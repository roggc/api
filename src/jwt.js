process.env.NODE_ENV==='dev'&& console.log('src/jwt')

import njwt from 'njwt'
import {ObjectID as ObjectId} from 'mongodb'

export const APP_SECRET='whateverYouWant$'

export const create=(data)=>
{
  let jwt=njwt.create(data,APP_SECRET)
  jwt.setExpiration(new Date().getTime()+(60*60*1000))
  return jwt.compact()
}

export const auth=({token})=>
{
  if(token)
  {
    const {body:{userId}}=njwt.verify(token,APP_SECRET)
    return userId
  }
}

// export const authenticate=async({headers}, db)=>
// {
//   if(headers)
//   {
//     const {authorization}=headers
//     if(authorization)
//     {
//       try
//       {
//         const {body:{userId}}=njwt.verify(authorization,APP_SECRET)
//         if(userId)
//         {
//           return await db.collection('users').findOne(ObjectId(userId))
//         }
//       }
//       catch (e)
//       {
//       }
//     }
//   }
// }
