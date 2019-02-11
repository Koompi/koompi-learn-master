
function base64ToBlob(contentType, data) {
  contentType = contentType || '';
  const sliceSize = 512;

  const byteCharacters = atob(data);
  const byteArrays = [];

  let offset = 0;
  let slice = null;
  let index = 0;

  for (; offset < byteCharacters.length; offset += sliceSize) {
    slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);

    for (; index < byteNumbers.length; index += 1) {
      byteNumbers[index] = slice.charCodeAt(index);
    }

    byteArrays.push(new Uint8Array(byteNumbers));

    index = 0;
  }

  const blob = new Blob(byteArrays, { type: contentType });

  return blob;
}

export default function (base64, filename) {
  const [contentTypeRaw, data] = base64.split(';');
  const contentType = contentTypeRaw.split(':')[1];
  const blob = base64ToBlob(contentType, data.split(',')[1]);
  const file = new File([blob], `${filename}.${contentType.split('/')[1]}`, {
    type: contentType,
  });

  return [file, contentType];
}
