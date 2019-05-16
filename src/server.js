import {MongoClient as mongo} from 'mongodb'
import {ApolloServer} from 'apollo-server'
import express from 'express'
import cors from 'cors'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const uri= process.env.MONGODB_URI
const name= process.env.MONGODB_URI.split('/')[3]

const app = express()
const port = process.env.PORT||3000

// app.use
// (
//   (req, res, next) =>
//   {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader
//     (
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     )
//     res.setHeader
//     (
//       "Access-Control-Allow-Methods",
//       "GET, POST, PATCH, DELETE, OPTIONS"
//     )
//     res.setHeader('Access-Control-Expose-Headers', ['Access-Control-Allow-Origin'
//     ,'Access-Control-Allow-Headers','Access-Control-Allow-Methods'])
//     next()
//   }
// )

//app.use(cors())
// app.options('*', cors())

const start=async()=>
{
  const db=await mongo.connect(uri,{useNewUrlParser:true}).then(cli=>cli.db(name))
  const server= new ApolloServer
  ({
    typeDefs,
    resolvers,
    context:({req})=>({db,req}),
    cors:
    {
      origin:'*',
      methods:'GET, POST, PATCH, DELETE, OPTIONS',
      allowedHeaders:'Origin, X-Requested-With, Content-Type, Accept',
      exposedHeaders:'Access-Control-Allow-Origin'
    }
  })
  server.listen().then(({ url }) =>
  {
    console.log(`🚀  Server ready at ${url}`)
  })
  // server.applyMiddleware({app,path:'/',cors:
  // {
  //   origin:'*',
  //   methods:'GET, POST, PATCH, DELETE, OPTIONS',
  //   allowedHeaders:'Origin, X-Requested-With, Content-Type, Accept',
  //   exposedHeaders:'Access-Control-Allow-Origin'
  // }})
  // app.listen(port,()=>console.log(`Now browse to localhost:${port}${server.graphqlPath}`))
}

start()
