
export default function addErrorToFormFields(
  formFields,
  keyMessageErrors,
  withKey = null,
) {
  let keys = null;

  if (withKey) {
    keys = Object.keys(keyMessageErrors);
  }

  return formFields.map((elem) => {
    elem.validationErrorMessage = null;

    if (withKey) {
      keys.map((key) => {
        if (keyMessageErrors[key] && key === elem.name) {
          elem.validationErrorMessage = keyMessageErrors[key];
        }

        return key;
      });
    } else {
      keyMessageErrors.map((el) => {
        if (el.key === elem.name && el.message) {
          elem.validationErrorMessage = el.message;
        }

        return el;
      });
    }

    return elem;
  });
}
