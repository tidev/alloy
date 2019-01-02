var Alloy = require("/alloy"), _ = require("/alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            id: "INTEGER PRIMARY KEY AUTOINCREMENT",
            info: "TEXT"
        },
        adapter: {
            type: "sql",
            db_name: "info",
            collection_name: "info",
            idAttribute: "id"
        }
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("info", exports.definition, []);

collection = Alloy.C("info", exports.definition, model);

exports.Model = model;

exports.Collection = collection;