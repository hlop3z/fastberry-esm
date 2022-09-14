import { onError, Edges, PageInfo } from "./fastberry";

const CORE_TYPES = ["Error", "ErrorMessage", "PageInfo"];

function generateTypes(apiTypes) {
  const allTypes = {};
  Object.keys(apiTypes).forEach((key) => {
    let fields = apiTypes[key];
    let setup = {};
    if (
      !(key.endsWith("Connection") || key.endsWith("Edge")) &&
      !CORE_TYPES.includes(key)
    ) {
      fields.forEach((field) => {
        if (field.scalar) {
          setup[field.name] = true;
        } else {
          setup[field.name] = field.type;
        }
      });
      allTypes[key] = setup;
    }
  });
  return allTypes;
}
function getFields({
  field = {},
  allTypes = {},
  maxDepth = -1,
  ignore = []
} = {}) {
  let count = 0;
  function getFieldsBase(field2) {
    let fields = {};
    Object.keys(field2).forEach((key) => {
      if (!ignore.includes(key)) {
        let active = field2[key];
        if (active === true) {
          fields[key] = true;
        } else {
          count += 1;
          if (count < maxDepth+1) {
            fields[key] = getFieldsBase(allTypes[active]);
          } 
        }
        count = 0;
      }
    });
    return fields;
  }
  return getFieldsBase(field);
}

function getType(items, name, maxDepth, ignore) {
  let node = getFields({
    field: items[name],
    maxDepth: maxDepth,
    allTypes: items,
    ignore: ignore,
  });
  return node;
}

class APITypes {
  constructor(GQLTypes, maxDepth, ignore) {
    /* DEFINITIONS */
    this.$types = GQLTypes;
    this.$allTypes = generateTypes(GQLTypes);
    this.$maxDepth = maxDepth;
    this.$ignore = ignore;
  }
  get types() {
    return Object.keys(this.$allTypes);
  }
  keys(name) {
    const model = getType(this.$allTypes, name, 1, []);
    return Object.keys(model);
  }
  get(name, maxDepth = 1, ignore = []) {
    const allIgnore = [...this.$ignore, ...ignore];
    const depth = maxDepth || this.$maxDepth;
    return getType(this.$allTypes, name, depth, allIgnore);
  }
}

export default function TypeManager({
  types = {},
  maxDepth = -1,
  ignore = [],
} = {}) {
  const allTypes = new APITypes(types, maxDepth, ignore);
  /* DEFINITIONS */
  allTypes.onError = onError;
  allTypes.edges = (model, maxDepth) =>
    Edges({
      manager: allTypes,
      model: model,
      maxDepth: maxDepth,
    });
  allTypes.pageInfo = PageInfo;
  return allTypes;
}
