
import gql from 'graphql-tag';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $username: String!,
    $email: String!,
    $password: String!,
    $signupRole: SignupRole = STUDENT
  ) {
    signup(
      username: $username,
      email: $email,
      password: $password,
      signupRole: $signupRole
    ) {
      ok
      errors {
        key
        message
      }
    }
  }
`;

export default SIGNUP_MUTATION;
