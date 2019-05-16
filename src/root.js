process.env.NODE_ENV==='dev'&& console.log('src/root')

import bcrypt from 'bcryptjs'
import {create,authenticate} from './jwt'

export default
{
  test1:async(args,context)=>
  {
    console.log(context)
    return 'sdf'
  },
  users:async(args,{db,req})=>
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
  },
  getActs:async({clientId},{db})=>
  {
    const errorCol= db.collection('errors')
    const errors=await errorCol.find().toArray()
    let out=
    {
      errors
    }
    const acts=db.collection('acts')
    const doc=await acts.findOne({clientId:clientId})
    if(doc)
    {
      out=
      {
        ...out,
        res:doc.acts
      }
      return out
    }
    const error= await errorCol.findOne({name:'noexists',category:'getActs'})
    out=
    {
      ...out,
      error
    }
    return out
  },
  signin:async(args,{db})=>
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
  login:async(args,{db})=>
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
  },
  pushAct:async({clientId,act,type},{db})=>
  {
    const errCol= db.collection('errors')
    const errors=await errCol.find({category:'pushAct'}).toArray()
    let out=
    {
      errors
    }
    const actCol=db.collection('acts')
    let doc
    if(doc=await actCol.findOne({clientId:clientId}))
    {
      let acts=doc.acts
      let index=-1
      acts.some
      (
        (act,i)=>
        {
          if(act.type===type)
          {
            act.act=act
            index=i
            return true
          }
        }
      )
      if(index>=0)
      {
        acts=acts.slice(0,index)
        doc=await actCol.findOneAndUpdate({clientId:clientId},{$set:{acts:acts}},{returnNewDocument:true})
      }
      else
      {
        doc=await actCol.findOneAndUpdate({clientId:clientId},{$push:{acts:{act:act,type:type}}},{returnNewDocument:true})
      }
      out=
      {
        ...out,
        res:doc._id
      }
      return out
    }
    doc=await actCol.findOneAndUpdate({clientId:clientId},{$push:{acts:{act:act,type:type}}},{upsert:true,returnNewDocument:true})
    out=
    {
      ...out,
      res:doc._id
    }
    return out
    // const error=await errCol.findOne({category:'pushAct',name:'dbconnection'})
    // out=
    // {
    //   ...out,
    //   error
    // }
    // return out
  },
  clearActs:async({clientId},{db})=>
  {
    const errCol=db.collection('errors')
    const errors=await errCol.find({category:'clearActs'}).toArray()
    let out=
    {
      errors
    }
    const actCol=db.collection('acts')
    const doc=await actCol.findOneAndUpdate({clientId:clientId},{$set:{acts:[]}})
    if(doc)
    {
      out=
      {
        ...out,
        res:doc._id
      }
      return out
    }
    const error= await errCol.findOne({category:'clearActs',name:'db'})
    out=
    {
      ...out,
      error
    }
    return out
  },
  User:
  {
    id: root => root._id || root.id
  }
}
