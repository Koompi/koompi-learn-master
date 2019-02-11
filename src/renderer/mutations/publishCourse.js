import gql from 'graphql-tag';

export default gql`
  mutation PublishCourseMutation($courseId: ID) {
    publishCourse(courseId: $courseId) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
