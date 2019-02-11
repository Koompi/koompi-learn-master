
import gql from 'graphql-tag';

export default gql`
  query CourseSectionVideoDetailQuery($courseSectionVideoId: ID!) {
    courseSectionVideoDetail(courseSectionVideoId: $courseSectionVideoId) {
      url
      title

      attachments {
        url
        description
      }
    }
  }
`;
