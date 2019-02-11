
import gql from 'graphql-tag';

export default gql`
  query CourseDetailQuery($courseId: ID!) {
    course(id: $courseId) {
      title

      ... on StudentCourseView {
        id
        price
        description
        introImageUrl
        introVideoUrl
        enrollCounts
        insertedAt

        coursesByTheInstructor {
          id
          title
          introImageUrl
          enrollCounts
          insertedAt
        }

        instructor {
          username
          email
          profile {
            lastName
            firstName
            gender
            bio
            profileImageUrl
          }
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
      }

      ... on OwnerCourseView {
        id
        price
        description
        introImageUrl
        introVideoUrl
        isPublish
        active
        insertedAt

        subjects {
          field
        }

        courseSections {
          id
          title
          description
          orderAs
          courseSectionVideos {
            id
            title
            length
            description
            url
            orderAs
          }
        }

        coursesByTheInstructor {
          id
          title
          introImageUrl
          insertedAt
        }

        instructor {
          username
          email
          profile {
            lastName
            firstName
            gender
            bio
            profileImageUrl
          }
        }

        approvals {
          approver {
            username
          }
        }
      }
    }
  }
`;
