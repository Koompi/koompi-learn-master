import gql from 'graphql-tag';

export default gql`
  mutation AddSubjectMutation ($field: String!) {
    addSubject(field: $field) {
      field
    }
  }
`;
