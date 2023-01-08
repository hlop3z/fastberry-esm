/*
@ GraphQL
*/
function ResponseData(data) {
  if (data) {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      return data[keys[0]];
    }
  }
  return data;
}

function GraphQLResponses(
  response,
  errorFields = ["error", "meta", "messages"]
) {
  let isError = response.errors ? true : false;
  let userErrors = response.errors ? response.errors : [];
  let serverData = response.data;
  let errorType = response.errors ? "request" : null;
  if (!response.errors) {
    Object.keys(serverData).forEach((key) => {
      const fields = Object.keys(serverData[key]);
      if (JSON.stringify(fields) === JSON.stringify(errorFields)) {
        if (serverData[key].error === true) {
          isError = true;
          errorType = "input";
        }
      }
    });
  }
  if (isError && errorType === "input") {
    serverData = null;
    userErrors = response.data;
  }
  return {
    data: ResponseData(serverData),
    errors: userErrors,
    error: isError,
    errorType: errorType,
  };
}

export default function initGraphQL(API) {
  return function GraphQL(query = null, props = {}) {
    return new Promise((resolve) => {
      API.$graphqlBase(query, props)
        .then((response) => {
          resolve(GraphQLResponses(response));
        })
        .catch((error) => {
          resolve({
            data: null,
            errors: [error],
            error: true,
            errorType: "network",
          });
        });
    });
  };
}
