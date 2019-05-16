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

app.use(cors())
app.options('*', cors())

const start=async()=>
{
  const db=await mongo.connect(uri,{useNewUrlParser:true}).then(cli=>cli.db(name))
  const server= new ApolloServer
  ({
    typeDefs,
    resolvers,
    context:({req})=>({db,req})
  })
  server.applyMiddleware({app,path:'/',cors:false})
  app.listen(port,()=>console.log(`Now browse to localhost:${port}${server.graphqlPath}`))
}

start()
