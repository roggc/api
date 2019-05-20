process.env.NODE_ENV==='dev'&& console.log('src/root')

import bcrypt from 'bcryptjs'
import {create,auth} from './jwt'
import {User} from './types/User'
import {Users} from './types/Users'

export default
{
  test1:({},{res})=>res.cookie('hola','adios'),
  users:async({},{db,req,res})=>
  {
    res.cookie('hola','byes',{path:'/'})
    const errCol=db.collection('errors')
    const errors=await errCol.find({function:'users'}).toArray()
    let out=
    {
      errors
    }
    if(!auth(req))
    {
      const error=await errCol.findOne({function:'users',name:'auth'})
      out=
      {
        ...out,
        error
      }
      return new Users(out)
    }
    const usersCol=db.collection('users')
    out=
    {
      ...out,
      res:await usersCol.find().toArray()
    }
    return new Users(out)
  },
  getActs:async({},{db,req})=>
  {
    const {ip}=req
    const errorCol= db.collection('errors')
    const errors=await errorCol.find().toArray()
    let out=
    {
      errors
    }
    const acts=db.collection('acts')
    const doc=await acts.findOne({ip:ip})
    if(doc)
    {
      out=
      {
        ...out,
        res:doc.acts
      }
      return out
    }
    const error= await errorCol.findOne({name:'noexists',function:'getActs'})
    out=
    {
      ...out,
      error
    }
    return out
  },
  signin:async({email,psswrd,name},{db})=>
  {
    const users=db.collection('users')
    const errCol=db.collection('errors')
    const errors= await errCol.find({function:'signin'}).toArray()
    let out=
    {
      errors
    }
    if(!email|| email.length===0||
      !psswrd|| psswrd.length===0||
      !name|| name.length===0)
    {
      return out
    }
    const user=await users.findOne({email:email})
    if(user)
    {
      const error=await errCol.findOne({name:'exists',function:'signin'})
      out=
      {
        ...out,
        error
      }
      return out
    }
    const psswrd2 = await bcrypt.hash(psswrd, 10)
    const resp = await users.insertOne({name,email,psswrd2})
    const newUser =
    {
      name,
      email,
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
  login:async({email,psswrd},{db,res})=>
  {
    res.cookie('hola','hello buddy')
    const users=db.collection('users')
    const errCol=db.collection('errors')
    const errors=await errCol.find({function:'login'}).toArray()
    let out=
    {
      errors
    }
    if(!email|| email.length===0||
      !psswrd|| psswrd.length===0)
    {
      return out
    }
    const user=await users.findOne({email})
    if(user)
    {
      const valid = await bcrypt.compare(psswrd, user.psswrd)
      if(valid)
      {
        try
        {
          const token=create({userId:user._id})
          if(token)
          {
            res.cookie('token', token,
            {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 31,
            })
            out=
            {
              ...out,
              res:
              {
                ...user,
                id:user._id
              }
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
    const error=await errCol.findOne({name:'wrongcredentials',function:'login'})
    out=
    {
      ...out,
      error
    }
    return out
  },
  logout:({},{res})=>
  {
    res.clearCookie('token')
    return true
  },
  pushAct:async({act,type},{db,req})=>
  {
    const {ip}=req
    const errCol= db.collection('errors')
    const errors=await errCol.find({function:'pushAct'}).toArray()
    let out=
    {
      errors
    }
    const actCol=db.collection('acts')
    let doc
    if(doc=await actCol.findOne({ip:ip}))
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
        doc=await actCol.findOneAndUpdate({ip:ip},{$set:{acts:acts}},{returnNewDocument:true})
      }
      else
      {
        doc=await actCol.findOneAndUpdate({ip:ip},{$push:{acts:{act:act,type:type}}},{returnNewDocument:true})
      }
      out=
      {
        ...out,
        res:doc._id
      }
      return out
    }
    doc=await actCol.findOneAndUpdate({ip:ip},{$push:{acts:{act:act,type:type}}},{upsert:true,returnNewDocument:true})
    out=
    {
      ...out,
      res:doc._id
    }
    return out
  },
  clearActs:async({},{db,req})=>
  {
    const {ip}=req
    const errCol=db.collection('errors')
    const errors=await errCol.find({function:'clearActs'}).toArray()
    let out=
    {
      errors
    }
    const actCol=db.collection('acts')
    const doc=await actCol.findOneAndUpdate({ip:ip},{$set:{acts:[]}})
    if(doc)
    {
      out=
      {
        ...out,
        res:doc._id
      }
      return out
    }
    const error= await errCol.findOne({function:'clearActs',name:'db'})
    out=
    {
      ...out,
      error
    }
    return out
  }
}
