import Forms from "./src/forms";
import Types from "./src/types";
import Operations from "./src/operations";

const Headers = (acessToken) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${acessToken}`,
});

class Fastberry {
    constructor(url, chain, types, forms, maxDepth, operations, ignore) {
        const allForms = Forms(forms);
        const allTypes = Types({
            types: types,
            maxDepth: maxDepth,
            ignore: ignore,
        });

        /* DEFINITIONS */
        this.$url = url;
        this.$api = null;
        this.$chain = chain;
        this.$forms = allForms;
        this.$types = allTypes;
        this.$operations = Operations(operations);
    }
    set api(options) {
        let chain = null;
        let url = options.url || this.$url;
        if (options.token) {
            chain = this.$chain(url, {
                headers: Headers(options.token)
            })
        } else {
            chain = this.$chain(url)
        }
        this.$api = chain
    }
    get api() {
        return this.$api;
    }
    get chain() {
        return this.$chain;
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
    url = null,
    chain = null,
    types = {},
    forms = [],
    maxDepth = -1,
    ignore = ["Id"],
    operations = {
        mutation: {},
        query: {}
    },
}) {
    return new Fastberry(url, chain, types, forms, maxDepth, operations, ignore);
}