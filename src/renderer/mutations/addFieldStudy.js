import gql from 'graphql-tag';

export default gql`
  mutation AddFieldStudyMutation ($field: String!, $subjects: [ID!]) {
    addFieldStudy(field: $field, subjects: $subjects) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
