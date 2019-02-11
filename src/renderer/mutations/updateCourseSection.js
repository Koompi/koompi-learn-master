import gql from 'graphql-tag';

export default gql`
  mutation UpdateCourseSectionMutation(
    $courseSectionId: ID!,
    $description: String,
    $title: String,
    $orderAs: Int
  ) {
    updateCourseSection(
      courseSectionId: $courseSectionId,
      description: $description,
      title: $title,
      orderAs: $orderAs
    ) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
