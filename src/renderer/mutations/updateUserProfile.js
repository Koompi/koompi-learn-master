
import gql from 'graphql-tag';

export default gql`
mutation UpdateUserProfileMutation(
  $firstName: String,
  $lastName: String,
  $gender: String,
  $phoneNumber: String,
  $bio: String,
  $email: String,
  $profileImageUrl: String
){
  updateUserProfile(profile: {
    firstName: $firstName,
    lastName: $lastName,
    gender: $gender,
    phone: $phoneNumber,
    bio: $bio,
    profileImageUrl: $profileImageUrl
  }, email: $email
  ) {
    ok
    errors {
      key
      message
    }
  }
}
`;
