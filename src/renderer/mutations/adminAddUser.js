import gql from 'graphql-tag';

export default gql`
  mutation AdminAddUserMutation (
    $username: String!,
    $password: String!,
    $email: String!,
    $roles: [String!]!,
  ) {
    addUser(
      username: $username,
      password: $password,
      email: $email,
      roles: $roles
    ) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
