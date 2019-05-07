import {MongoClient as mongo} from 'mongodb'
import {ApolloServer,gql} from 'apollo-server-express'
import express from 'express'
const uri= process.env.MONGODB_URI
const name= process.env.MONGODB_URI.split('/')[3]
const app = express()
const typeDefs = gql
`
  type Query {
    hello: String
  }
`
const resolvers =
{
  Query:
  {
    hello:(obj,args,{db},info)=> db.collection('any').findOne({name:'Roger'}).then(doc=>doc.name)
  }
}
mongo.connect(uri,{useNewUrlParser:true}).then
(
  mongo=>
  {
    const db=mongo.db(name)
    const server= new ApolloServer({
      typeDefs,
      resolvers,
      context:{db}
    })
    server.applyMiddleware({app,path:'/'})
    app.listen(4000, () => console.log(`Now browse to localhost:4000${server.graphqlPath}`))
  }
)
