import gql from 'graphql-tag';

export default gql`
  mutation UpdateSubjectMutation ($id: ID!, $field: String!) {
    updateSubject(id: $id, field: $field) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
