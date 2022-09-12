function getFields({ field = {}, all_types = {}, max_depth = 5 } = {}) {
  let count = 0;
  function getFieldsBase(field) {
    count += 1;
    let fields = {};
    Object.keys(field).forEach((key) => {
      let active = field[key];
      if (active === true) {
        fields[key] = true;
      } else {
        if (count < max_depth + 1) {
          fields[key] = getFieldsBase(all_types[active]);
        }
      }
    });
    return fields;
  }
  return getFieldsBase(field);
}

function getType(name, items, max_depth) {
  let node = getFields({
    field: items[name],
    max_depth: max_depth,
    all_types: items,
  });
  return node;
}

class TypeManager {
  constructor(types, max_depth) {
    this.all_types = types;
    this.max_depth = max_depth;
  }
  static load({ types = {}, max_depth = 3 } = {}) {
    return new TypeManager(types, max_depth);
  }
  get keys() {
    return Object.keys(this.all_types);
  }
  get(name, max_depth = null) {
    const depth = max_depth || this.max_depth;
    return getType(name, this.all_types, depth);
  }
}

export default TypeManager.load;
