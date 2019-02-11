
export function formatNetworkErrors(errors) {
  if (errors && errors.detail) {
    return errors.detail;
  }

  return errors;
}

export function formatGraphqlErrors(errors) {
  return errors;
}
