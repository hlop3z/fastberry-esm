const DateTime = {
  date() {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    return date;
  },
  time() {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  },
  datetime() {
    return new Date();
  },
};

function generateTypes(api_types) {
  const all_types = {};
  Object.keys(api_types).forEach((key) => {
    let fields = api_types[key];
    let form_fields = fields;
    let form_inputs = {};
    fields.forEach((field) => {
      if (field.default) {
        let defaultValue = field.default;
        if (field.type === "String") {
          try {
            defaultValue = JSON.parse(defaultValue);
          } catch (e) {
            defaultValue = defaultValue;
          }
        }
        form_inputs[field.name] = defaultValue;
      } else if (!field.default && field.list) {
        let defaultValue = [];
        form_inputs[field.name] = defaultValue;
      } else if (!field.default && !field.list) {
        let time_related = DateTime[field.type.toLowerCase()];
        if (typeof time_related === "function") {
          form_inputs[field.name] = () => time_related();
        } else if (field.type === "JSON") {
          form_inputs[field.name] = {};
        } else {
          let defaultValue = null;
          form_inputs[field.name] = defaultValue;
        }
      } else {
        let defaultValue = null;
        form_inputs[field.name] = defaultValue;
      }
    });
    all_types[key] = {
      fields: form_fields,
      form: form_inputs,
    };
  });
  return all_types;
}

function createForm(all_types, formName, ignore = []) {
  const inputForm = all_types[formName].form;
  const outForm = {};
  Object.keys(inputForm).forEach((field) => {
    const defaultValue = inputForm[field];
    let value = null;
    if (typeof defaultValue === "function") {
      value = defaultValue();
    } else {
      value = defaultValue;
    }
    if (!ignore.includes(field)) {
      outForm[field] = value;
    }
  });
  return outForm;
}

class APIForms {
  constructor(GQLForms) {
    this.$forms = generateTypes(GQLForms);
  }
  get forms() {
    return Object.keys(this.$forms);
  }
  keys(name) {
    return Object.keys(createForm(this.$forms, name, []));
  }
  get(name, ignore = []) {
    return createForm(this.$forms, name, ignore);
  }
  labels(name, setup = {}, ignore = []) {
    const keys = this.keys(name);
    const labels = {};
    keys.forEach((key) => {
      if (!ignore.includes(key)) {
        let defaultValue = setup[key];
        let value = key.toUpperCase();
        if (defaultValue) {
          value = defaultValue;
        }
        labels[key] = value;
      }
    });
    return labels;
  }
}

export default function FormManager(GQLForms) {
  return new APIForms(GQLForms);
}
