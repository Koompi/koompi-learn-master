
import gql from 'graphql-tag';

export default gql`
  query SubjectQuery($limit: Int, $offset: Int){
    subjects(limit: $limit, offset: $offset) {
      id
      field
    }
  }
`;
