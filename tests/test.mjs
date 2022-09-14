import Fastberry from "../dist/fastberry.mjs";
import Types from "./types.mjs";
import Forms from "./forms.mjs";
import Operations from "./operations.mjs";

const API = Fastberry({
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
