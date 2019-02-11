
export default function queryFunc(parent, query, variables = {}, options = {}) {
  return new Promise((resolve, reject) => {
    parent.$apollo.query({
      query,

      variables,

      ...options,
    })
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
}
