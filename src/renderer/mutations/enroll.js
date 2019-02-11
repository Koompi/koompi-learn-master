
import gql from 'graphql-tag';

export default gql`
mutation EnrollMutation($courseId: ID!) {
  enroll(courseId: $courseId) {
    ok
    errors {
      key
      message
    }
  }
}
`;
