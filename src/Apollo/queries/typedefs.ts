import { gql } from "@apollo/client"

export const typeDefs = gql`
  extend type Query {
    sort: [Sort]
  }

  input EmailContactInput {
    name: String
    email: String
    message: String
  }

  input EmailProjectInput {
    name: String
    email: String
    nameProject: String
    emailProject: String
    agreedTerms: Boolean
    projectName: String
    about: String
    agreedResearch: Boolean
    agreedUpfront: Boolean
    aboutUs: String
    decideWork: String
    feedback: String
  }

  type Sort {
    name: String
    order: String
  }
`
