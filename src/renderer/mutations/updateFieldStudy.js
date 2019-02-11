import gql from 'graphql-tag';

export default gql`
  mutation UpdateFieldStudyMutation (
    $id: ID!,
    $field: String!,
    $subjects: [ID]
  ) {
    updateFieldStudy(id: $id, field: $field, subjects: $subjects) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
