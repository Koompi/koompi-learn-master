import gql from 'graphql-tag';

export default gql`
  mutation UpdateRoleMutation($userId: ID!, $roles: [String]) {
    updateRole(roles: $roles, userId: $userId) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
