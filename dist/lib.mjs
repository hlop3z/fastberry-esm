/*! 
* Fastberry @ Copyright 2023
* MIT @ License 
*/
/* eslint-disable */

// src/api/graphql.js
function ResponseData(data) {
  if (data) {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      return data[keys[0]];
    }
  }
  return data;
}
function GraphQLResponses(response, errorFields = ["error", "meta", "messages"]) {
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
    errorType
  };
}
function initGraphQL(API2) {
  return function GraphQL(query = null, props = {}) {
    return new Promise((resolve) => {
      API2.$graphqlBase(query, props).then((response) => {
        resolve(GraphQLResponses(response));
      }).catch((error) => {
        resolve({
          data: null,
          errors: [error],
          error: true,
          errorType: "network"
        });
      });
    });
  };
}

// src/api/parser.js
function getOperations(query) {
  return query.match(/\b(?:query|mutation)\b([^{\n]*){([^}]*)}/g);
}
function getVariables(query) {
  let match = query.match(
    /\$([A-Za-z][A-Za-z0-9]*):[ ]?([A-Za-z_][A-Za-z0-9_]*[!]?)/g
  );
  const matches = [];
  if (match) {
    match.forEach((m) => {
      matches.push(m.split(":"));
    });
  }
  return matches;
}
function getName(query) {
  return query.match(/\s*(\w+)/g)[1].trim();
}
function QueryToJson(query) {
  const matches = getOperations(query);
  const operations = {};
  matches.forEach((item) => {
    const operationFields = {};
    const op_name = getName(item);
    const variables = getVariables(item);
    variables.forEach((v) => {
      const field_name = v[0].trim().replace("$", "");
      operationFields[field_name] = {
        name: field_name,
        type: v[1].trim().replace("!", ""),
        required: v[1].endsWith("!")
      };
    });
    const operationForm = {};
    Object.values(operationFields).forEach((item2) => {
      operationForm[item2.name] = null;
    });
    operations[op_name] = {
      args: operationFields,
      form: operationForm
    };
  });
  return operations;
}
var parser_default = QueryToJson;

// src/api/utils.js
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
      returnValue.$type = "list";
      returnValue.items = getNodes(response.data.edges);
      if (response.data.pageInfo) {
        returnValue.pageInfo = response.data.pageInfo;
      }
    } else {
      returnValue.$type = "dict";
      returnValue.data = response.data;
    }
  }
  return returnValue;
}
var GraphqlScriptCrud = class {
  constructor(options) {
    this.$script = options.script ? options.script : "";
    this.$api = options.api ? options.api : {};
    const scriptItems = parser_default(this.$script);
    scriptItems.$keys = Object.keys(scriptItems);
    this.op = Object.freeze(scriptItems);
  }
  // Core Methods
  get api() {
    return this.$api;
  }
  crud(operationName, variables = null) {
    return this.$api.$crud(this.$script, {
      operationName,
      variables
    });
  }
  run(operationName, variables = null) {
    return this.$api.$graphqlBase(this.$script, {
      operationName,
      variables
    });
  }
};
function ScriptGraphQL(options = {}) {
  return new GraphqlScriptCrud(options);
}
function CRUD(self) {
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

// src/api/index.js
function APIHandler(URL, OPTIONS) {
  return new Promise((myResolve, myReject) => {
    fetch(URL, OPTIONS).then((response) => response.json()).then((json) => myResolve(json)).catch((error) => myReject(error));
  });
}
function URLFixer(baseURL, url) {
  const mainURL = baseURL.endsWith("/") ? baseURL : baseURL + "/";
  const apiURL = !url.startsWith("/") ? url : url.substring(1);
  return mainURL + apiURL;
}
var API = class {
  constructor(baseURL, options) {
    this.host = baseURL;
    this.options = options;
    this.baseURL = (url) => URLFixer(this.host, url);
    this.$graphql = initGraphQL(this);
    this.$crud = CRUD(this);
    this.graphql = (script) => ScriptGraphQL({ api: this, script });
  }
  /* Create - API */
  static createAPI(baseURL, options = {}) {
    const OPTIONS = {
      mode: "cors",
      credentials: "same-origin",
      // same-origin include
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    };
    return new API(baseURL, { ...OPTIONS, ...options });
  }
  /* GET */
  ["get"](url = null, data = false) {
    const params = !data ? "" : `?${new URLSearchParams(data).toString()}`;
    const path = `${this.baseURL(url)}${params}`;
    const myoptions = { method: "GET" };
    const options = { ...this.options, ...myoptions };
    return APIHandler(path, options);
  }
  /* POST */
  ["post"](url = null, data = false) {
    const path = `${this.baseURL(url)}`;
    const params = !data ? data : JSON.stringify(data);
    const myoptions = { method: "POST" };
    if (data) {
      myoptions.body = params;
    }
    const options = { ...this.options, ...myoptions };
    return APIHandler(path, options);
  }
  /* PUT */
  ["put"](url = null, data = false) {
    const path = `${this.baseURL(url)}`;
    const params = !data ? data : JSON.stringify(data);
    const myoptions = { method: "PUT" };
    if (data) {
      myoptions.body = params;
    }
    const options = { ...this.options, ...myoptions };
    return APIHandler(path, options);
  }
  /* DELETE */
  ["delete"](url = null, data = false) {
    const path = `${this.baseURL(url)}`;
    const params = !data ? data : JSON.stringify(data);
    const myoptions = { method: "DELETE" };
    if (data) {
      myoptions.body = params;
    }
    const options = { ...this.options, ...myoptions };
    return APIHandler(path, options);
  }
  /* PATCH */
  ["patch"](url = null, data = false) {
    const path = `${this.baseURL(url)}`;
    const params = !data ? data : JSON.stringify(data);
    const myoptions = { method: "PATCH" };
    if (data) {
      myoptions.body = params;
    }
    const options = { ...this.options, ...myoptions };
    return APIHandler(path, options);
  }
  /* GraphQL */
  ["$graphqlBase"](query = null, props = {}) {
    const $props = props ? props : {};
    const myoptions = { query };
    const operationName = $props.operationName ? $props.operationName : null;
    const variables = $props.variables ? $props.variables : null;
    if (variables) {
      myoptions.variables = variables;
    }
    if (operationName) {
      myoptions.operationName = operationName;
    }
    return this.post("graphql", myoptions);
  }
};
var api_default = API.createAPI;

// app.js
var app_default = api_default;
export {
  app_default as default
};
