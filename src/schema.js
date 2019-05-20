import {buildSchema} from 'graphql'

const schema=
`
  type Query
  {
    users:UsersOut!
    getActs:GetActs
    test1:Boolean
  },
  type ClearActs
  {
    res:Int
    error:Error
    errors:[Error]
  },
  type GetActs
  {
    res:[GetActsRes]
    error:Error
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
    function:String!
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
    pushAct(act:String,type:String):PushAct
    clearActs:ClearActs
    logout:Boolean
  },
  type PushAct
  {
    res:Int
    error:Error
    errors:[Error]
  }
`


export default buildSchema(schema)
