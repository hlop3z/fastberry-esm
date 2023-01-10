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

// Demo (Item & List)
graphql.task.item.current = {
  id: "Mzo6NGQ0MDk4MzIxNjU0YTQ1Nw==",
  title: "First App",
  description: "create an example app.",
  status: "open",
};

graphql.task.item.current = {
  id: "Mjo6M2VmOWFiYmI1ZGY1YjY0MQ==",
  title: "Post Tutorial",
  description: "post the example app.",
  status: "open",
};

// Item (Object)
console.log(graphql.task.item.loading);
console.log(graphql.task.item.current);
console.log(graphql.task.item.last);
console.log(graphql.task.item.history);

// List (Array)
console.log(graphql.task.list.pagination);

// Search (Array)
console.log(graphql.task.search.history);
```

<br>

## Core

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
```

<br>

## Fields for Model

| Property      | Type   | Definition                              |
| ------------- | ------ | --------------------------------------- |
| **`methods`** | Array  | All { Operations } in the GraphQL Query |
| **`form`**    | Object | All { Forms } for each Operation        |
| **`args`**    | Object | All { Args } for each Operation         |
| **`item`**    | Object | Single Instance Manager                 |
| **`list`**    | Object | Default List Manager                    |
| **`search`**  | Object | Search List Manager                     |

### Example Usage

```js
graphql.{ MODEL_NAME }.methods
```

<br>

## Fields for [ Item, List, Search ]

| Property         | Type    | Definition               |
| ---------------- | ------- | ------------------------ |
| **`current`**    | Any     | Current value            |
| **`last`**       | Any     | Last value               |
| **`history`**    | Array   | Last 3 values            |
| **`pagination`** | Object  | Pagination Form          |
| **`loading`**    | Boolean | Object is Loading?       |
| **`error`**      | Object  | Error Information        |
| **`info`**       | Object  | Current Page Information |
| **`selected`**   | Array   | Selected Item(s)         |

### Example Usage

```js
graphql.{ MODEL_NAME }.item.current
```
