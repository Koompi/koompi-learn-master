
export default function mutationFunc(
  parent,
  mutation,
  variables,
  options = {},
) {
  return new Promise((resolve, reject) => {
    parent.$apollo.mutate({
      mutation,

      variables,

      ...options,
    })
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
}
