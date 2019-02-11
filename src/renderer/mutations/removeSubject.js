import gql from 'graphql-tag';

export default gql`
  mutation RemoveSubjectMutation ($id: ID!) {
    removeSubject(id: $id) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
