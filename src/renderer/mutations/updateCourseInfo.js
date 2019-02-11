import gql from 'graphql-tag';

export default gql`
  mutation UpdateCourseInfoMutation(
    $courseId: ID!,
    $active: Boolean,
    $title: String,
    $description: String,
    $price: Decimal,
    $subjects: [String!],
    $introImageUrl: String,
    $introVideoUrl: String
  ) {
    updateCourse(
      courseId: $courseId,
      active: $active,
      title: $title,
      description: $description,
      price: $price,
      subjects: $subjects,
      introImageUrl: $introImageUrl,
      introVideoUrl: $introVideoUrl
    ) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
