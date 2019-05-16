import {buildSchema} from 'graphql'

export default buildSchema
(
  `
    type Query
    {
      test1:String
      users:UsersOut!,
      getActs(clientId:String):GetActs
    },
    type ClearActs
    {
      res:Int
      error:Error
      errors:[Error]
    },
    type GetActs
    {
      res:[GetActsRes],
      error:Error,
      errors:[Error]
    },
    type GetActsRes
    {
      act:String
      type:String
    },
    type Error
    {
      name:String!
      message:String!
      category:String!
    },
    type AuthOut
    {
      res:User
      error:Error
      errors:[Error]
    },
    type User
    {
      id: ID!
      name: String!
      email: String!
    },
    type UsersOut
    {
      res:[User]
      error:Error
      errors:[Error]
    },
    type Mutation
    {
      signin(email: String!, psswrd: String!, name: String!): AuthOut!
      login(email: String!, psswrd: String!): AuthOut!
      pushAct(clientId:String,act:String,type:String):PushAct
      clearActs(clientId:String):ClearActs
    },
    type PushAct
    {
      res:Int
      error:Error
      errors:[Error]
    }
  `
)
