
export default function formValueSerialize(formElements, formFields) {
  let fieldValue = null;
  const values = {};
  const errors = [];

  formFields.forEach((elem) => {
    if (elem.uniqueId) {
      fieldValue = document.getElementById(elem.uniqueId);

      if (elem.type === 'tag') {
        if (elem.commonClassName) {
          fieldValue = fieldValue.getElementsByClassName(elem.commonClassName);
        } else {
          fieldValue = fieldValue
            .getElementsByClassName(
              `${elem.type}-${elem.uniqueId || elem.name}`,
            );

          const newVal = new Array(fieldValue.length);
          let index = 0;

          const valueProperty =
            elem.getFromDataValue ? 'dataset' : 'innerText';

          for (; index < fieldValue.length; index += 1) {
            if (valueProperty === 'dataset') {
              newVal[index] = fieldValue[index].dataset.value;
            } else {
              newVal[index] = fieldValue[index].innerText;
            }
          }

          fieldValue = newVal;
        }
      } else if (elem.type === 'video' || elem.type === 'image') {
        fieldValue = fieldValue.files[0];
      }
    } else if (elem.type === 'radio') {
      formElements[elem.name].forEach((rad) => {
        if (rad.checked) {
          fieldValue = rad.value;
        }
      });
    } else {
      fieldValue = formElements[elem.name].value;
    }

    if (!fieldValue && !elem.isOptional) {
      errors.push({
        key: elem.name,
        message: 'Cannot be empty',
      });

      return;
    }

    values[elem.name] = fieldValue;
  });

  return { values, errors };
}
