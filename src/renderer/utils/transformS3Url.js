
export default function transformS3Url(url) {
  if (!url) {
    return null;
  }

  if (
    url.includes('ap-southeast-1') || !url.includes('s3')
  ) {
    return url;
  }

  const index = url.indexOf('s3') + 's3'.length;

  return `${url.slice(0, index)}-ap-southeast-1${url.slice(index)}`;
}
