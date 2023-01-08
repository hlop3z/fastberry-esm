function getNodes(edges) {
  const list = [];
  edges.forEach((item) => {
    list.push(item.node);
  });
  return list;
}

function getData(response) {
  const returnValue = {};
  if (!response.error && response.data) {
    if (response.data.edges) {
      // Process List
      returnValue.$type = "list";
      returnValue.items = getNodes(response.data.edges);
      if (response.data.pageInfo) {
        returnValue.pageInfo = response.data.pageInfo;
      }
    } else {
      // Process Dict
      returnValue.$type = "dict";
      returnValue.data = response.data;
    }
  }
  return returnValue;
}

class GraphqlScriptCrud {
  constructor(options) {
    this.$script = options.script;
    this.$api = options.api;
  }
  $op(operationName, variables = null) {
    return this.$api.$crud(this.$script, {
      operationName: operationName,
      variables: variables,
    });
  }
  // Core Methods
  get api() {
    return this.$api;
  }
  get crud() {
    return this.$op;
  }
  run(operationName, variables = null) {
    return this.$api.$graphqlBase(this.$script, {
      operationName: operationName,
      variables: variables,
    });
  }
}

// GraphQL { CRUD } Script
export function CRUD(self) {
  return (query = null, props = {}) => {
    return new Promise((resolve) => {
      self.$graphql(query, props).then((response) => {
        const returnValue = { ...response };
        if (!response.error) {
          returnValue.data = getData(response);
        }
        resolve(returnValue);
      });
    });
  };
}

export function ScriptGraphQL(options = {}) {
  return new GraphqlScriptCrud(options);
}
