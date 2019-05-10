import {gql} from 'apollo-server-express'

export default gql
`
  type Query
  {
    users:UsersOut!
  }

  type Error
  {
    name:String!
    message:String!
  }

  type AuthOut
  {
    res:User
    error:Error
    errors:[Error]
  }

  type User
  {
    id: ID!
    name: String!
    email: String!
  }

  type UsersOut
  {
    res:[User]
    error:Error
    errors:[Error]
  }

  type Mutation
  {
    signin(email: String!, psswrd: String!, name: String!): AuthOut!
    login(email: String!, psswrd: String!): AuthOut!
  }
`
