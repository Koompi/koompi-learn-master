
import gql from 'graphql-tag';

export default gql`
  query IsMyRoleQuery ($role: String!) {
    isMyRole(role: $role)
  }
`;
