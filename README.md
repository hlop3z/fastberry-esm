# Fastberry (ESM-JavaScript)

## Install

```sh
npm i fastberry
```

<br>

```js
import fastberry from "fastberry";

// Start Backend
const backend = fastberry("http://localhost:8000");

// Create A Script
const GQLScript = `
fragment PageFields on PageInfo {
  length
  pages
}
fragment ModelFields on Task {
  id
  title
  description
  status
}
query Detail {
  detail(item: "MTo6YTU1ZTUzMmVhYjAyOGI0Mg==") {
    ...ModelFields
  }
}
query Search {
  search(status: "open") {
    edges {
      node {
        ...ModelFields
      }
    }
    pageInfo {
      ...PageFields
    }
  }
}
`;

// (GraphQL) Start A Manager
const graphql = backend.graphql(Query);

// Run
graphql.run("Search").then((response) => {
  console.log(response);
});

// CRUD
graphql.crud("Search").then((response) => {
  console.log(response);
});

// API (Regular)
graphql.api
  .post("graphql", {
    query: Query,
    operationName: "Search",
  })
  .then((response) => {
    console.log(response);
  });
```
