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
import Controller from 'fastberry';
import { Chain } from './zeus';

const API = Controller({
    chain: Chain("http://localhost:8000/graphql"),
    types: Fastberry.Types,
    forms: Fastberry.Forms,
    max_depth: 3,
});

// Forms
console.log(API.form.keys)
console.log(API.form.get("Item"))
console.log(API.form.find["Pagination"])

// Form: Fields
console.log(API.form.find["Pagination"].fields)

// Form: Labes | Note: You Can Ignore Fields
console.log(API.form.find["FormSearch"].labels({ setup: { amount: "Cash Money" }, ignore: ["timestamp"] })

// Form: Blank Values
console.log(API.form.get("FormSearch"))

// Form: Custom Default Values | Note: You Can Ignore Fields
console.log(API.form.find["FormSearch"].form({ setup: { amount: { amount: 0 } }, ignore: ["timestamp"] })

// Types
console.log(API.type.keys)
console.log(API.type.get("Product", -1)) // No-Child <GQL-Nodes>
console.log(API.type.edges("Product"))
```