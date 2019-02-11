import gql from 'graphql-tag';

export default gql`
  query AdminAllUserQuery (
    $limit: Int,
    $offset: Int,
    $username: String,
    $orderByDate: Boolean,
    $orderByActive: Boolean
  ) {
    listUsers (
      limit: $limit,
      offset: $offset,
      username: $username,
      orderByDate: $orderByDate,
      orderByActive: $orderByActive
    ) {
      id
      username
      email
      active
      insertedAt

      roles {
        id
        title
      }
    }
  }
`;
