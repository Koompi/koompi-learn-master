
import gql from 'graphql-tag';

export default gql`
  query CoursesQuery(
    $title: String,
    $limit: Int,
    $subjects: [String],
    $isMostView: BoolOrderValue,
    $isHighestPrice: Boolean,
    $orderBy: CourseSearchOrderFilter
  ) {
    courses(
      title: $title,
      limit: $limit,
      subjects: $subjects,
      isMostView: $isMostView,
      isHighestPrice: $isHighestPrice,
      orderBy: $orderBy
    ) {
      id
      title
      enrollCounts
      isPublish
      introImageUrl
      instructorName
      insertedAt
      updatedAt
    }
  }
`;
