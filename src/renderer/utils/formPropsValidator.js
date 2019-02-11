
export default function formPropsValidator(arrayOfObject) {
  let index = 0;

  for (; index < arrayOfObject.length; index += 1) {
    if (
      typeof arrayOfObject[index].label !== 'string' ||
      typeof arrayOfObject[index].type !== 'string' ||
      typeof arrayOfObject[index].name !== 'string'
    ) {
      return false;
    }

    if (arrayOfObject[index].type === 'select') {
      if (
        !arrayOfObject[index].options ||
        !arrayOfObject[index].options.length
      ) {
        return false;
      }

      let innerIndex = 0;

      for (;
        innerIndex < arrayOfObject[index].options.length; innerIndex += 1) {
        if (
          typeof
          arrayOfObject[index].options[innerIndex].label !== 'string' ||
          !arrayOfObject[index].options[innerIndex].value
        ) {
          return false;
        }
      }
    }
  }

  return true;
}
