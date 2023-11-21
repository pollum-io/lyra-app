import { gql } from "@apollo/client"

export const SEND_CONTACT = gql`
  mutation SendContact($input: EmailContactInput!) {
    sendContact(input: $input) {
      success
      message
    }
  }
`

export const SEND_PROJECT = gql`
  mutation SendProject($input: EmailProjectInput!) {
    sendProject(input: $input) {
      success
      message
    }
  }
`
