import gql from 'graphql-tag';

export default gql`
  mutation UpdatePasswordWithResetMutation(
    $newPassword: String!,
    $newPasswordRetype: String!
  ) {
    updatePasswordWithReset(
      newPassword: $newPassword,
      newPasswordRetype: $newPasswordRetype
    ) {
      ok
      errors {
        key
        message
      }
    }
  }
`;
