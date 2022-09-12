# Demo

## Fake-Setup
```js
const FORMS = [
  {
    fields: [
      {
        name: "amount",
        type: "Decimal",
      },
      {
        name: "endDatetime",
        type: "Datetime",
      },
      {
        name: "name",
        type: "String",
      },
      {
        name: "startDate",
        type: "Date",
      },
      {
        name: "timestamp",
        type: "Time",
      },
    ],
    form: {
      amount: null,
      endDatetime: null,
      name: null,
      startDate: null,
      timestamp: null,
    },
    labels: {
      amount: "Amount",
      endDatetime: "End Datetime",
      name: "Name",
      startDate: "Start Date",
      timestamp: "Timestamp",
    },
    name: "FormSearch",
  },
  {
    fields: [
      {
        name: "id",
        type: "String",
      },
      {
        name: "ids",
        type: "Array",
      },
    ],
    form: {
      id: null,
      ids: [],
    },
    labels: {
      id: "Id",
      ids: "Ids",
    },
    name: "Item",
  },
  {
    fields: [
      {
        name: "all",
        type: "Boolean",
      },
      {
        name: "limit",
        type: "Integer",
      },
      {
        name: "page",
        type: "Integer",
      },
      {
        name: "sortBy",
        type: "String",
      },
    ],
    form: {
      all: null,
      limit: null,
      page: null,
      sortBy: null,
    },
    labels: {
      all: "All",
      limit: "Limit",
      page: "Page",
      sortBy: "Sort By",
    },
    name: "Pagination",
  },
];

const TYPES = {
  Group: {
    id: true,
    name: true,
  },
  Category: {
    id: true,
    name: true,
  },
  Product: {
    aliases: true,
    availableFrom: true,
    category: "Category",
    createdOn: true,
    group: "Group",
    id: true,
    isAvailable: true,
    isObject: true,
    name: true,
    notes: true,
    price: true,
    sameDayShippingBefore: true,
    stock: true,
  },
};

const Fastberry = {
  Types: TYPES,
  Forms: FORMS,
};
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