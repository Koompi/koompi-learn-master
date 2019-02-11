import gql from 'graphql-tag';

export default gql`
  mutation UpdateCourseSectionVideoMutation(
    $courseSectionVideoId: ID!,
    $courseSectionVideo: CourseSectionVideoInput!
  ) {
    updateCourseSectionVideo(
      courseSectionVideoId: $courseSectionVideoId,
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
