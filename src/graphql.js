import API from "./api";

/**
 * Model Part Handler
 * @property {Any} current        Current value
 * @property {Any} last           Last value
 * @property {Array} history      Last 3 values
 * @property {Object} pagination  Pagination Form
 * @property {Boolean} loading    Object is Loading?
 * @property {Object} error       Error Information
 * @property {Object} info        Current Page Information
 * @property {Array} selected     Selected ITEM(s)
 */
class SchemaList {
  constructor(list = false, maxSize = 3) {
    // Max-Size
    this._maxSize = maxSize;

    // Reactive Dict
    const dict = {
      history: [],
      current: null,
      loading: true,
      error: {},
    };

    if (list) {
      dict.info = {};
      dict.selected = [];
      dict.pagination = reactive({
        page: 1,
        limit: 50,
        sortBy: "-id",
        all: false,
      });
    }

    // Init Reactive
    this._ = reactive(dict);
  }

  // Setters Only
  setbyAPI(value) {
    this._.current = value;
    this._.history.push(value);
    const size = this._.history.length;
    if (size > this._maxSize) {
      this._.history.shift();
    }
  }

  // Getters Only
  get last() {
    return this._.history[this._.history.length - 2];
  }
  get history() {
    return this._.history;
  }
  get pagination() {
    return this._.pagination;
  }
  get selected() {
    return this._.selected;
  }

  // Setters & Getters
  set current(value) {
    return this.setbyAPI(value);
  }
  get current() {
    return this._.current;
  }
  get loading() {
    return this._.loading;
  }
  set loading(value) {
    this._.loading = value;
  }
  get error() {
    return this._.error;
  }
  set error(value) {
    this._.error = value;
  }
  get info() {
    return this._.info;
  }
  set info(value) {
    this._.info = value;
  }
}

/**
 * GraphQL Model Manager
 * @property {Object} api      Backend API
 * @property {Function} models Create GraphQL Models
 * @property {Object} graphql  Manage GraphQL Models
 */
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
      item: new SchemaList(false),
      list: new SchemaList(true),
      search: new SchemaList(true),
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
    /**
     * GraphQL Model Manager
     * @property {Array} methods  All { Operations } in the GraphQL Query
     * @property {Object} form    All { Forms } for each Operation
     * @property {Object} args    All { Args } for each Operation
     * @property {Object} item    Single Instance Manager
     * @property {Object} list    List Manager
     * @property {Object} search  Search Manager
     */
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
