import gql from 'graphql-tag';

export default gql`
  mutation RemoveFieldStudyMutation ($id: ID) {
    removeFieldStudy(id: $id) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
