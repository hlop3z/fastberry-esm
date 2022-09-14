import Forms from "./src/forms";
import Types from "./src/types";
import Operations from "./src/operations";

class Fastberry {
  constructor(chain, types, forms, maxDepth, operations, ignore) {
    const allForms = Forms(forms);
    const allTypes = Types({
      types: types,
      maxDepth: maxDepth,
      ignore: ignore,
    });

    /* DEFINITIONS */
    this.$chain = chain;
    this.$forms = allForms;
    this.$types = allTypes;
    this.$operations = Operations(operations);
  }
  get chain() {
    return this.$forms;
  }
  get form() {
    return this.$forms;
  }
  get type() {
    return this.$types;
  }
  get operations() {
    return this.$operations;
  }
  get ops() {
    return this.$operations;
  }
}

export default function Controller({
  chain = null,
  types = {},
  forms = [],
  maxDepth = -1,
  ignore = ["Id"],
  operations = { mutation: {}, query: {} },
}) {
  return new Fastberry(chain, types, forms, maxDepth, operations, ignore);
}
