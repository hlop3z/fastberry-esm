import Dict from './pyDict';

function getInputs(items) {
  const ops = {};
  Object.keys(items).forEach((key) => {
    const active = items[key];
    ops[key] = {};
    active.forEach((field) => {
      let defaultValue = field.default;
      if (!field.scalar) {
        defaultValue = field.type;
      }
      if (field.type === 'String') {
        try {
          defaultValue = JSON.parse(defaultValue);
        } catch (err) {
          // pass
        }
      }
      ops[key][field.name] = defaultValue;
    });
    ops[key] = Dict(ops[key]);
  });
  return Dict(ops);
}

class APIOps {
  constructor(GQLOps) {
    const query = getInputs(GQLOps.query);
    const mutation = getInputs(GQLOps.mutation);
    const allKeys = [...query.keys(), ...mutation.keys()];

    /* DEFINITIONS */
    this.$ops = GQLOps;
    this.$keys = allKeys;
    this.$query = query;
    this.$mutation = mutation;
  }

  get core() {
    return this.$ops;
  }

  get query() {
    return this.$query;
  }

  get mutation() {
    return this.$mutation;
  }

  get keys() {
    return this.$keys;
  }

  get operations() {
    return this.$keys;
  }

  get ops() {
    return this.$keys;
  }
}

export default function OpsManager(GQLOps) {
  return new APIOps(GQLOps);
}
