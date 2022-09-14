# Fastberry (ESM-JavaScript)

<br>

> ### **Fastberry** JavaScript **Controller**

<br>

## Depends on [**Zeus**](https://www.npmjs.com/package/graphql-zeus)

### Install

```sh
npm i graphql-zeus
```

### Build Client

```sh
zeus schema.graphql ./
```

## Example

```js
import Fastberry from 'fastberry';
import { Chain } from './zeus';

import Types from "./types.json";
import Forms from "./forms.json";
import Operations from "./operations.json";

const API = Fastberry({
    chain: Chain,
    types: Types,
    forms: Forms,
    operations: Operations,
    ignore: ["Id"],
});

// Forms
console.log(API.form.forms);
console.log(API.form.get("FormSearch"));
console.log(API.form.get("Pagination", ["all"])); // Ignores: [all]
console.log(API.form.keys("Pagination"));
console.log(API.form.labels("Pagination", { all: "all" }));
console.log(API.form.labels("Pagination", {}, ["all"])); // Ignore: [all].

// Types
console.log(API.type.types);
console.log(API.type.get("Product"));
console.log(API.type.get("Product", 1, ["category", "group"])); // Ignore: [category, group]
console.log(API.type.keys("Product"));

// Operations
console.log(API.operations.query);
console.log(API.operations.mutation);
```