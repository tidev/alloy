var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            name: "text",
            status: "integer"
        },
        defaults: {
            name: "",
            captured: 0
        },
        adapter: {
            type: "sql",
            collection_name: "heroes"
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

model = Alloy.M("heroes", exports.definition, []);

collection = Alloy.C("heroes", exports.definition, model);

exports.Model = model;

exports.Collection = collection;