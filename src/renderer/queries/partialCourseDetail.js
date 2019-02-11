import gql from 'graphql-tag';

export default gql`
  query CourseDetailQuery($courseId: ID!) {
    course(id: $courseId) {
      title

      ... on StudentCourseView {
        courseSections {
          id
          title
          orderAs
          description

          courseSectionVideos {
            id
            orderAs
            title
          }
        }
      }
    }
  }
`;
