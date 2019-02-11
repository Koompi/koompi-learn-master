
export default function (arrObj, sortField) {
  return [...arrObj].sort((objA, objB) => {
    if (objA[sortField] < objB[sortField]) {
      return -1;
    } else if (objA[sortField] > objB[sortField]) {
      return 1;
    }

    return 0;
  });
}
