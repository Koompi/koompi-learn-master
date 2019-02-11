
import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      userId
      isResetPassword
    }
  }
`;

export default LOGIN_MUTATION;
