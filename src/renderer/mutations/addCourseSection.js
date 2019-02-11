import gql from 'graphql-tag';

export default gql`
mutation AddCourseSectionMutation (
  $courseId: ID!,
  $description: String!,
  $orderAs: Int!,
  $title: String!,
  $courseSectionVideos: [CourseSectionVideoInput]
) {
  addCourseSection(
    courseId: $courseId,
    description: $description,
    orderAs: $orderAs,
    title: $title,
    courseSectionVideos: $courseSectionVideos
  ) {
    ok
    errors {
      key
      message
    }
  }
}
`;
