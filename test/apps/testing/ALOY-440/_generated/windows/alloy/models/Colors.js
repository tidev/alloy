var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            color: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "colors"
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

model = Alloy.M("colors", exports.definition, []);

collection = Alloy.C("colors", exports.definition, model);

exports.Model = model;

exports.Collection = collection;