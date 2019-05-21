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
const port = process.env.PORT||4000

app.use
(
  cors
  (
    {
      origin:['https://rr-ssr.herokuapp.com','http://localhost:3000'],
      credentials:true
    }
  )
)
app.options('*', cors())
app.use(cookieParser())

const start=async()=>
{
  const db=await mongo.connect(uri,{useNewUrlParser:true}).then(cli=>cli.db(name))

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
