var Alloy = require("/alloy"), _ = require("/alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            title: "String"
        },
        adapter: {
            type: "properties",
            collection_name: "test"
        }
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