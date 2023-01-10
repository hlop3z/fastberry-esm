# Fastberry (**Vue** + Vite)

## Install

```sh
npm i fastberry
```

<br>

## GraphQL

```graphql
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
query Search($status: String) {
  search(status: $status) {
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
```

<br>

## JavaScript

```js
/*
  @ Example With => { Vite }
*/
import TaskGQL from "./Task.graphql?raw";
import fastberry from "./fastberry";

// Start Backend
const Admin = fastberry();

// (GraphQL) Start Manager
const graphql = Admin.models({
  task: TaskGQL,
});

// Admin { Search - Operation }
graphql.task.ops
  .Search({
    status: "open",
  })
  .then((response) => {
    console.log(response);
  });

// API Regular (Detail - Operation)
Admin.api
  .post("graphql", {
    query: TaskGQL,
    operationName: "Detail",
  })
  .then((response) => {
    console.log(response);
  });

// Get OPERATION { Args }
console.log("Args");
console.log(graphql.task.args.Search);

// Get OPERATION { Form } Vue-Reactive
console.log("Form");
console.log(graphql.task.form.Search);
```
