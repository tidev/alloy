var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    configuration: {
        columns: {
            username: "string"
        },
        adapter: {
            type: "sql",
            collection_name: "test"
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

model = Alloy.M("test", exports.definition, []);

collection = Alloy.C("test", exports.definition, model);

exports.Model = model;

exports.Collection = collection;