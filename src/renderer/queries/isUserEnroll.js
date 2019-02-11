
import gql from 'graphql-tag';

export default gql`
query IsUserEnrollQuery($courseId: ID!) {
  isUserEnroll(courseId: $courseId)
}
`;
