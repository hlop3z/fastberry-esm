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
console.log(GQL.type.get("Product", 2, ["category", "group"])); // Depth-Search: [2] and Ignore: [category, group]
console.log(API.type.keys("Product"));

// Operations
console.log(API.operations.query.keys());
console.log(API.operations.mutation.keys());
```

### Python-Style { Dict }

```js
const pyDict = GQL.dict({ msg: "hello world" });

console.log(pyDict.keys())
console.log(pyDict.values())
console.log(pyDict.items())
console.log(pyDict.dict())
console.log(pyDict.dir)
```
