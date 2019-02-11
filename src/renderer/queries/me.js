
import gql from 'graphql-tag';

export default gql`
{
  me {
    id
    email
    username
    profile {
      lastName
      firstName
      phone
      gender
      bio
      profileImageUrl
    }

    ... on Student {
      courseEnrolls {
        title

        ... on StudentCourseView {
          id
          enrollCounts
          introImageUrl
          insertedAt
          instructor {
            username
          }
        }
      }
    }

    ... on Instructor {
      courses {
        id
        title
        enrollCounts
        introImageUrl
        insertedAt
      }
    }
  }
}
`;
