function cloneForm(obj = {}, defaults = {}) {
  let form = { ...obj };
  let value = null;
  let fields = Object.keys(form);
  Object.keys(defaults).forEach((key) => {
    if (fields.includes(key)) {
      value = defaults[key];
    }
    form[key] = value;
  });
  return form;
}
function ignoreFields(fields = [], obj = {}, ignore = []) {
  let form = {};
  Object.keys(obj).forEach((key) => {
    if (!ignore.includes(key) && fields.includes(key)) {
      form[key] = obj[key];
    }
  });
  return form;
}
function FormSchema({
  fields = [],
  model = {},
  defaults = {},
  ignore = [],
} = {}) {
  const form = cloneForm(model, defaults);
  return ignoreFields(fields, form, ignore);
}

class Form {
  constructor(setup) {
    this.$core = setup;
  }
  get name() {
    return this.$core.name;
  }
  get keys() {
    return Object.keys(this.$core.form);
  }
  get fields() {
    return this.$core.fields;
  }
  get form() {
    return ({ setup = {}, ignore = [] } = {}) =>
      this.$blank({ setup: setup, ignore: ignore, base: this.$core.form });
  }
  get labels() {
    return ({ setup = {}, ignore = [] } = {}) =>
      this.$blank({ setup: setup, ignore: ignore, base: this.$core.labels });
  }
  $blank({ setup = {}, ignore = [], base = {} } = {}) {
    let clientForm = FormSchema({
      model: base,
      fields: Object.keys(base),
      defaults: setup,
      ignore: ignore,
    });
    return { ...clientForm };
  }
}

function FormCreate(json) {
  const forms = {};
  json.forEach((item) => {
    forms[item.name] = new Form(item);
  });
  return forms;
}

class Manager {
  constructor(list) {
    this.$forms = FormCreate(list);
  }
  get keys() {
    return Object.keys(this.$forms);
  }
  get find() {
    return this.$forms;
  }
  get(name) {
    return this.$forms[name].form();
  }
}
function ManagerCreate(list) {
  return new Manager(list);
}
export default ManagerCreate;
