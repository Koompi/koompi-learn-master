import gql from 'graphql-tag';

export default gql`
  query COURSES_ADMIN_QUERY(
    $title: String,
    $limit: Int,
    $subjects: [String],
    $isMostView: BoolOrderValue,
    $isHighestPrice: Boolean,
    $orderBy: CourseSearchOrderFilter,
    $offset: Int
  ) {
    adminListCourses(
      title: $title,
      limit: $limit,
      subjects: $subjects,
      isMostView: $isMostView,
      isHighestPrice: $isHighestPrice,
      orderBy: $orderBy,
      offset: $offset
    ) {
      id
      title
      isPublish
      approvals {
        approver {
          id
        }
        isApproved
      }
      insertedAt
      instructorName
    }
  }
`;
