var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            name: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "Demo"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("Demo", exports.definition, []);

collection = Alloy.C("Demo", exports.definition, model);

exports.Model = model;

exports.Collection = collection;