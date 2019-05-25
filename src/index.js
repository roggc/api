process.env.NODE_ENV==='dev'&& console.log('src/index')

import {MongoClient as mongo} from 'mongodb'
import graphql from 'express-graphql'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import schema from './schema'
import root from './root'

const uri= process.env.MONGODB_URI
const name= process.env.MONGODB_URI.split('/')[3]

const app = express()
const port = process.env.PORT||5000

app.use
(
  cors
  (
    {
      origin:['http://localhost:4000','http://enjoy.easygoo.tk','http://www.royalty.ga'],
      credentials:true
    }
  )
)
app.options('*', cors())
app.use(cookieParser())

const start=async()=>
{
  const db=await mongo.connect(uri,{useNewUrlParser:true}).then(cli=>cli.db(name))
                .catch(e=>console.log('Error:', e))

  app.use
  (
    graphql
    (
      (req,res)=>
      {
        const ob=
        {
          schema,
          rootValue: root,
          graphiql: true,
          context:
          {
            req,
            res,
            db
          }
        }
        return ob
      }
    )
  )

  app.listen(port,()=>console.log(`Now browse to localhost:${port}`))
}

start()
