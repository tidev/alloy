var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            title: "text",
            latitude: "real",
            longitude: "real"
        },
        adapter: {
            type: "sql",
            collection_name: "pins"
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

model = Alloy.M("pins", exports.definition, []);

collection = Alloy.C("pins", exports.definition, model);

exports.Model = model;

exports.Collection = collection;