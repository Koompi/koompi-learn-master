
/*
  eslint max-len: [0]
*/

import shortid from 'shortid';

export function uploadFile(method, url, file, { progressCallback, headers, errorCallback = () => {} }) {
  const tempId = shortid.generate();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', file.type);

    if (headers && headers.length) {
      headers.forEach(header => xhr.setRequestHeader(...header));
    }

    xhr.onload = () => {
      if (xhr.status !== 200) {
        reject(new Error(`Request failed. Status: ${xhr.status}. Content: ${xhr.responseText}`));
      }

      resolve(xhr.responseText);
    };

    xhr.upload.onerror = (error) => {
      errorCallback(error);
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = (event.loaded / event.total) * 100;

        progressCallback(percentCompleted, file, tempId);
      }
    };

    xhr.send(file);
  });
}

export default async function s3Upload(file, presignedUrl, options = {}) {
  try {
    await uploadFile(
      'PUT',
      presignedUrl.uploadUrl,
      file,
      options,
    );

    return { file, remoteUrl: presignedUrl.url };
  } catch (error) {
    throw error;
  }
}
