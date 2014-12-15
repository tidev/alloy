var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            title: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "rows"
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

model = Alloy.M("rows", exports.definition, []);

collection = Alloy.C("rows", exports.definition, model);

exports.Model = model;

exports.Collection = collection;