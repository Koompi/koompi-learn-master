
import gql from 'graphql-tag';

export default gql`
  query CourseSectionsQuery($courseId: ID!) {
    course(id: $courseId) {
      title

      ... on StudentCourseView {
        id
        description
        introImageUrl
        introVideoUrl
        insertedAt
        updatedAt
        enrollCounts

        subjects {
          field
        }

        courseSections {
          id
          title
          orderAs
          courseSectionVideos {
            id
            title
            orderAs
          }
        }

        instructor {
          username
          profile {
            firstName
            lastName
            bio
            gender
          }
        }
      }

    }
  }
`;
