process.env.NODE_ENV==='dev'&& console.log('src/resolvers')

import bcrypt from 'bcryptjs'
import {create,authenticate} from './jwt'

export default
{
  Query:
  {
    users:async(obj,args,{db,req})=>
    {
      const errCol=db.collection('errors')
      const errors=await errCol.find({category:'users'}).toArray()
      let out=
      {
        errors
      }
      const user=await authenticate(req,db)
      if(!user)
      {
        const error=await errCol.findOne({category:'users',name:'auth'})
        out=
        {
          ...out,
          error
        }
        return out
      }
      const usersCol=db.collection('users')
      const res=await usersCol.find().toArray()
      out=
      {
        ...out,
        res
      }
      return out
    }
  },
  Mutation:
  {
    signin:async(obj,args,{db})=>
    {
      const users=db.collection('users')
      const errCol=db.collection('errors')
      const errors= await errCol.find({category:'signin'}).toArray()
      let out=
      {
        errors
      }
      if(!args.email|| args.email.length===0||
        !args.psswrd|| args.psswrd.length===0||
        !args.name|| args.name.length===0)
      {
        return out
      }
      const user=await users.findOne({email:args.email})
      if(user)
      {
        const error=await errCol.findOne({name:'exists',category:'signin'})
        out=
        {
          ...out,
          error
        }
        return out
      }
      const psswrd = await bcrypt.hash(args.psswrd, 10)
      const resp = await users.insertOne({...args,psswrd})
      const newUser =
      {
        name: args.name,
        email: args.email,
        id:resp.insertedId
      }
      try
      {
        const token=create({userId:newUser.id})
        if(token)
        {
          out=
          {
            ...out,
            res:newUser
          }
          return out
        }
        return out
      }
      catch (e)
      {
        out=
        {
          ...out,
          error:
          {
            name:'token',
            message:e.message||'ksjdfjsdfij'
          }
        }
        return out
      }
    },
    login:async(obj,args,{db})=>
    {
      const users=db.collection('users')
      const errCol=db.collection('errors')
      const errors=await errCol.find({category:'login'}).toArray()
      let out=
      {
        errors
      }
      if(!args.email|| args.email.length===0||
        !args.psswrd|| args.psswrd.length===0)
      {
        return out
      }
      const user=await users.findOne({email:args.email})
      if(user)
      {
        const valid = await bcrypt.compare(args.psswrd, user.psswrd)
        if(valid)
        {
          try
          {
            const token=create({userId:user._id})
            if(token)
            {
              out=
              {
                ...out,
                res:user
              }
              return out
            }
            return out
          }
          catch (e)
          {
            out=
            {
              ...out,
              error:
              {
                name:'token',
                message:e.message||'ksjdfjsdfij'
              }
            }
            return out
          }
        }
      }
      const error=await errCol.findOne({name:'wrongcredentials',category:'login'})
      out=
      {
        ...out,
        error
      }
      return out
    }
  },
  User:
  {
    id: root => root._id || root.id
  }
}
