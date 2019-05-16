import {MongoClient as mongo} from 'mongodb'
import {ApolloServer} from 'apollo-server'
import graphql from 'express-graphql'
import express from 'express'
import cors from 'cors'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schema from './schema'
import root from './root'

const uri= process.env.MONGODB_URI
const name= process.env.MONGODB_URI.split('/')[3]

const app = express()
const port = process.env.PORT||4000

// app.use(cors(
//   {
//     origin:'*',
//     methods:'GET, POST, PATCH, DELETE, OPTIONS',
//     allowedHeaders:'Origin, X-Requested-With, Content-Type, Accept',
//     exposedHeaders:'Access-Control-Allow-Origin'
//   }
// ))
//app.options('*', cors())
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
    res.setHeader('Access-Control-Expose-Headers','Access-Control-Allow-Origin')
    next()
  }
)

const start=async()=>
{
  const db=await mongo.connect(uri,{useNewUrlParser:true}).then(cli=>cli.db(name))
  // app.use
  // (
  //   graphql
  //   (
  //     {
  //       schema: schema,
  //       rootValue: root,
  //       context:{message:'hello'},
  //       graphiql: true
  //     }
  //   )
  // )

  // app.use(graphql(async (request, response, graphQLParams) => ({
  //   schema: schema,
  //   rootValue: root,//await someFunctionToGetRootValue(request),
  //   context:{message:'hello'},
  //   graphiql: true
  // })))

  app.use
  (
    graphql
    (
      req=>
      (
        {
          schema,
          rootValue: root,
          graphiql: true,
          context:
          {
            req,
            db
          }
        }
      )
    )
  )

  // const server= new ApolloServer
  // ({
  //   typeDefs,
  //   resolvers,
  //   context:({req})=>({db,req}),
  //   cors:
  //   {
  //     origin:'*',
  //     methods:'GET, POST, PATCH, DELETE, OPTIONS',
  //     allowedHeaders:'Origin, X-Requested-With, Content-Type, Accept',
  //     exposedHeaders:'Access-Control-Allow-Origin'
  //   }
  // })
  // server.listen({port:port}).then(({url}) =>
  // {
  //   console.log(`🚀  Server ready at ${url}`)
  // })
  // server.applyMiddleware({app,path:'/',cors:
  // {
  //   origin:'*',
  //   methods:'GET, POST, PATCH, DELETE, OPTIONS',
  //   allowedHeaders:'Origin, X-Requested-With, Content-Type, Accept',
  //   exposedHeaders:'Access-Control-Allow-Origin'
  // }})
  app.listen(port,()=>console.log(`Now browse to localhost:${port}`))
}

start()
