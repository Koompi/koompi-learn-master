import gql from 'graphql-tag';

export default gql`
  mutation AddCourseMutation(
    $title: String!,
    $description: String!,
    $introImageUrl: String,
    $introVideoUrl: String,
    $courseSections: [CourseSectionInput],
    $subjects: [String!]!,
  ) {
    addCourse(
      title: $title,
      description: $description,
      introImageUrl: $introImageUrl,
      introVideoUrl: $introVideoUrl,
      courseSections: $courseSections,
      subjects: $subjects
    ) {
      ok
      message
      errors {
        key
        message
        isJson
      }
    }
  }
`;
