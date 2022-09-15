function Dict(initKwargs = {}) {
  /**
     *
     * @param {object} kwargs Python style Dict = Object(JavaScript)
     */
  class PythonDict {
    constructor() {
      this.$data = {};
      this.$dir = [
        'keys',
        'values',
        'items',
        'dict',
        'forDict((key, value) => { console.log(key, value); });',
        'forList((item) => { console.log(item); });',
      ];
      // Init
      this.update(initKwargs);
    }

    static createClass() {
      return Object.create(new PythonDict());
    }

    get(key) {
      return this.$data[key];
    }

    set(key, value) {
      this.$data[key] = value;
    }

    update(kwargs) {
      const keys = Object.keys(kwargs);
      keys.forEach((key) => {
        this.set(key, kwargs[key]);
      });
    }

    del(key) {
      delete this.$data[key];
    }

    dict() {
      return this.$data;
    }

    keys() {
      return Object.keys(this.$data);
    }

    values() {
      return Object.values(this.$data);
    }

    items() {
      const keys = Object.keys(this.$data);
      const items = [];
      keys.forEach((key) => {
        items.push([key, this.$data[key]]);
      });
      return items;
    }

    get dir() {
      return this.$dir;
    }

    get data() {
      return this.$data;
    }

    forDict(method = null) {
      return this.items().map((i) => method(i[0], i[1]));
    }

    forList(method = null) {
      return this.items().map((i) => method(i));
    }
  }

  // Create New Object => Python-Style <dict>
  return PythonDict.createClass();
}

export default Dict;
