
import gql from 'graphql-tag';

export default gql`
  query PresignUrlQuery($fileType: String!, $tempId: String) {
    presignUrl(fileType: $fileType, tempId: $tempId) {
      url
      uploadUrl
    }
  }
`;
