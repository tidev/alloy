var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            item: "text",
            done: "integer",
            date_completed: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "todo"
        }
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("todo", exports.definition, []);

collection = Alloy.C("todo", exports.definition, model);

exports.Model = model;

exports.Collection = collection;