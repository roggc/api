import {MongoClient as mongo} from 'mongodb'
import {ApolloServer} from 'apollo-server-express'
import express from 'express'
import cors from 'cors'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const uri= process.env.MONGODB_URI
const name= process.env.MONGODB_URI.split('/')[3]

const app = express()
const port = process.env.PORT||3000

// app.use(cors())
// app.options('*', cors())

app.use
(
  (req, res, next) =>
  {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader
    (
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    )
    res.setHeader
    (
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    )
    res.setHeader('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin')
    next()
  }
)

const start=async()=>
{
  const db=await mongo.connect(uri,{useNewUrlParser:true}).then(cli=>cli.db(name))
  const server= new ApolloServer
  ({
    typeDefs,
    resolvers,
    context:({req})=>({db,req})
  })
  server.applyMiddleware({app,path:'/',cors:{origin:'*'}})
  app.listen(port,()=>console.log(`Now browse to localhost:${port}${server.graphqlPath}`))
}

start()
