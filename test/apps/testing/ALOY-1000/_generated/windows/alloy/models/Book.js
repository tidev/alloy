var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            title: "text",
            author: "text",
            genre: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "book"
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

model = Alloy.M("book", exports.definition, []);

collection = Alloy.C("book", exports.definition, model);

exports.Model = model;

exports.Collection = collection;