import gql from 'graphql-tag';

export default gql`
  mutation ResetPasswordMutation($email: String!) {
    resetPassword(email: $email) {
      ok
      errors {
        key
        message
      }
    }
  }
`;

