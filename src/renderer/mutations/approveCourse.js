import gql from 'graphql-tag';

export default gql`
  mutation ApproveCourseMutation($courseId: ID!, $isApproved: Boolean!) {
    approveCourse(courseId: $courseId, isApproved: $isApproved) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
