import gql from 'graphql-tag';

export default gql`
  query FieldStudyQuery($limit: Int, $offset: Int) {
    fieldStudies(limit: $limit, offset: $offset) {
      id
      field

      subjects {
        id
        field
      }
    }
  }
`;
