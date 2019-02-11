
export default function readFile(type, fileObj, callback = val => val) {
  return new Promise((resolve, reject) => {
    callback('begin');

    switch (type) {
      case 'image': {
        const reader = new FileReader();

        reader.onload = (event) => {
          resolve(event.target.result);

          callback(event.target.result);
        };

        reader.onerror = (error) => {
          callback('end');

          reject(error);
        };

        reader.readAsDataURL(fileObj);

        break;
      }

      case 'video': {
        try {
          const url = URL.createObjectURL(fileObj);

          resolve(url);

          callback(url);
        } catch (error) {
          reject(error);
        }

        break;
      }

      default: resolve(true);
    }
  });
}
