var Alloy = require("/alloy"), _ = require("/alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            name: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "fruits"
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

model = Alloy.M("fruits", exports.definition, []);

collection = Alloy.C("fruits", exports.definition, model);

exports.Model = model;

exports.Collection = collection;