
function arrayObjectReduceFlattening(fieldToFlattenOut) {
  return function flattening(accumulator, object, index) {
    accumulator[index] = object[fieldToFlattenOut];

    return accumulator;
  };
}

export default function flattenArrayObjectByField(
  arrayOfObject,
  fieldToFlattenOut,
) {
  return arrayOfObject.reduce(
    arrayObjectReduceFlattening(fieldToFlattenOut),
    new Array(arrayOfObject.length),
  );
}
