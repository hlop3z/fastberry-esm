import { onError, Edges, PageInfo } from './fastberry';

const CORE_TYPES = ['Error', 'ErrorMessage', 'PageInfo'];

function generateTypes(apiTypes) {
  const allTypes = {};
  Object.keys(apiTypes).forEach((key) => {
    const fields = apiTypes[key];
    const setup = {};
    if (
      !(key.endsWith('Connection') || key.endsWith('Edge'))
      && !CORE_TYPES.includes(key)
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
  ignore = [],
} = {}) {
  let count = 0;
  function getFieldsBase(item) {
    const fields = {};
    Object.keys(item).forEach((key) => {
      if (!ignore.includes(key)) {
        const active = item[key];
        if (active === true) {
          fields[key] = true;
        } else {
          count += 1;
          if (count < maxDepth + 1) {
            fields[key] = getFieldsBase(allTypes[active]);
          }
          count = 0;
        }
      }
    });
    return fields;
  }
  return getFieldsBase(field);
}

function getType(items, name, maxDepth, ignore) {
  const node = getFields({
    field: items[name],
    maxDepth,
    allTypes: items,
    ignore,
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
  allTypes.edges = (type, depth) => Edges({
    manager: allTypes,
    model: type,
    maxDepth: depth,
  });
  allTypes.pageInfo = PageInfo;
  return allTypes;
}
