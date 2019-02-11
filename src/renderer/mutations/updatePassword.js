
import gql from 'graphql-tag';

export default gql`
  mutation UpdatePasswordMutation(
    $oldPassword: String!,
    $newPassword: String!,
    $newPasswordRetype: String!
  ) {
    updatePassword(
      oldPassword: $oldPassword,
      newPassword: $newPassword,
      newPasswordRetype: $newPasswordRetype,
    ) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
