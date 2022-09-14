import Fastberry from "../dist/fastberry.mjs";
import Types from "./backend/types.mjs";
import Forms from "./backend/forms.mjs";
import Operations from "./backend/operations.mjs";

const API = Fastberry({
    types: Types,
    forms: Forms,
    operations: Operations,
    ignore: ["Id"],
});

// Forms
test('Form: List all GraphQL forms.', () => {
    expect(API.form.forms).toStrictEqual(['FormCategory', 'FormProduct', 'FormSearch', 'Item', 'Pagination']);
});

test('Form: Get form inputs.', () => {
    const active = API.form.get("Pagination")
    expect(Object.keys(active)).toStrictEqual(["all", "limit", "page", "sortBy"]);
});

test('Form: Get form inputs & ignore fields.', () => {
    const active = API.form.get("Pagination", ["all"])
    expect(Object.keys(active)).toStrictEqual(["limit", "page", "sortBy"]);
});

test('Form: Get form keys.', () => {
    expect(API.form.keys("Pagination")).toStrictEqual(["all", "limit", "page", "sortBy"]);
});

test('Form: Get form labels.', () => {
    const active = API.form.labels("Pagination")
    expect(Object.keys(active)).toStrictEqual(["all", "limit", "page", "sortBy"]);
});

test('Form: Get form labels & ignore fields.', () => {
    const active = API.form.labels("Pagination", {}, ["all"])
    expect(Object.keys(active)).toStrictEqual(["limit", "page", "sortBy"]);
});


// Types
test('Type: List all GraphQL types.', () => {
    expect(API.type.types).toStrictEqual(['Category', 'Group', 'Product']);
});

test('Type: Get type fields.', () => {
    const active = API.type.get("Category")
    expect(Object.keys(active)).toStrictEqual(["id", "name", "group"]);
});

test('Type: Get type fields & ignore fields.', () => {
    const active = API.type.get("Category", 1, ["id"])
    expect(Object.keys(active)).toStrictEqual(["name", "group"]);
});

test('Type: Get type keys.', () => {
    const active = API.type.keys("Category")
    expect(active).toStrictEqual(['Id', 'id', 'name', 'group']);
});


// Operations
test('Query: List All.', () => {
  const active = API.operations.query
  expect(Object.keys(active)).toStrictEqual(['goodAppWarehouseCategory', 'goodAppWarehouseDetail', 'goodAppWarehouseSearch']);
});

test('Mutation: List All.', () => {
  const active = API.operations.mutation
  expect(Object.keys(active)).toStrictEqual(['goodAppWarehouseCreateCategory', 'goodAppWarehouseCreateProduct']);
});
