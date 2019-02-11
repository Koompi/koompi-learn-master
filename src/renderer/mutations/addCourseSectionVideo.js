import gql from 'graphql-tag';

export default gql`
  mutation AddCourseSectionVideoMutation(
    $courseSectionId: ID!,
    $courseSectionVideo: CourseSectionVideoInput!
  ) {
    uploadCourseSectionVideo(
      courseSectionId: $courseSectionId,
      courseSectionVideo: $courseSectionVideo
    ) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
