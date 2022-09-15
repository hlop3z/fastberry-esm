const DateTime = {
  date() {
    const today = new Date();
    const date = `${today.getFullYear()
    }-${
      today.getMonth() + 1
    }-${
      today.getDate()}`;
    return date;
  },
  time() {
    const today = new Date();
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    return time;
  },
  datetime() {
    return new Date();
  },
};

function generateTypes(apiTypes) {
  const allTypes = {};
  Object.keys(apiTypes).forEach((key) => {
    const fields = apiTypes[key];
    const formFields = fields;
    const formInputs = {};
    fields.forEach((field) => {
      if (field.default) {
        let defaultValue = field.default;
        if (field.type === 'String') {
          try {
            defaultValue = JSON.parse(defaultValue);
          } catch (err) {
            // pass
          }
        }
        formInputs[field.name] = defaultValue;
      } else if (!field.default && field.list) {
        const defaultValue = [];
        formInputs[field.name] = defaultValue;
      } else if (!field.default && !field.list) {
        const timeRelated = DateTime[field.type.toLowerCase()];
        if (typeof timeRelated === 'function') {
          formInputs[field.name] = () => timeRelated();
        } else if (field.type === 'JSON') {
          formInputs[field.name] = {};
        } else {
          const defaultValue = null;
          formInputs[field.name] = defaultValue;
        }
      } else {
        const defaultValue = null;
        formInputs[field.name] = defaultValue;
      }
    });
    allTypes[key] = {
      fields: formFields,
      form: formInputs,
    };
  });
  return allTypes;
}

function createForm(allTypes, formName, ignore = []) {
  let inputForm = allTypes[formName];
  if (inputForm) {
    inputForm = inputForm.form;
  } else {
    inputForm = {};
  }
  const outForm = {};
  Object.keys(inputForm).forEach((field) => {
    const defaultValue = inputForm[field];
    let value = null;
    if (typeof defaultValue === 'function') {
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

  fields(name) {
    const active = this.$forms[name];
    let returnValue = null;
    if (active) {
      returnValue = active.fields;
    }
    return returnValue;
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
        const defaultValue = setup[key];
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
