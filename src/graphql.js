import API from "./api";

class Manager {
  constructor(url = "http://localhost:8000", options) {
    this.api = API(url, options);
    this._graphql = {};
  }
  get graphql() {
    return this._graphql;
  }
  get gql() {
    return this._graphql;
  }
  model(name, script) {
    const admin = this.api.graphql(script);
    const setup = {
      methods: Object.freeze(admin.op.$keys),
      form: {},
      args: {},
      ops: {},
    };
    admin.op.$keys.forEach((key) => {
      setup.ops[key] = (props) => admin.crud(key, props);
      const current = admin.op[key];
      if (Object.keys(current.form).length > 0) {
        setup.form[key] = reactive(current.form);
        setup.args[key] = current.args;
      } else {
        setup.form[key] = {};
        setup.args[key] = {};
      }
    });
    this._graphql[name] = setup;
    // console.log(this._graphql[name]);
    return this._graphql[name];
  }
  models(obj) {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      this.model(key, val);
    });
    return this.graphql;
  }
}

function Admin(...args) {
  return new Manager(...args);
}

export default Admin;
