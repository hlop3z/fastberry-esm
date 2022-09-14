export default {
  mutation: {
    goodAppWarehouseCreateCategory: [
      {
        default: null,
        list: false,
        name: "form",
        required: true,
        scalar: false,
        type: "FormCategory",
      },
    ],
    goodAppWarehouseCreateProduct: [
      {
        default: null,
        list: false,
        name: "form",
        required: true,
        scalar: false,
        type: "FormProduct",
      },
    ],
  },
  query: {
    goodAppWarehouseCategory: [
      {
        default: null,
        list: false,
        name: "items",
        required: true,
        scalar: false,
        type: "Item",
      },
      {
        default: '"-id"',
        list: false,
        name: "hello",
        required: true,
        scalar: true,
        type: "String",
      },
    ],
    goodAppWarehouseDetail: [
      {
        default: null,
        list: false,
        name: "items",
        required: true,
        scalar: false,
        type: "Item",
      },
    ],
    goodAppWarehouseSearch: [
      {
        default: null,
        list: false,
        name: "search",
        required: true,
        scalar: false,
        type: "FormSearch",
      },
      {
        default: null,
        list: false,
        name: "pagination",
        required: true,
        scalar: false,
        type: "Pagination",
      },
    ],
  },
};
