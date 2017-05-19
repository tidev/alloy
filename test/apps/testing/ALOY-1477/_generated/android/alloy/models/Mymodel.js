var Alloy = require("/alloy"), _ = require("/alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            id: "INTEGER PRIMARY KEY AUTOINCREMENT",
            title: "TEXT"
        },
        adapter: {
            type: "sql",
            collection_name: "mymodel",
            idAttribute: "id"
        }
    }
};

model = Alloy.M("mymodel", exports.definition, []);

collection = Alloy.C("mymodel", exports.definition, model);

exports.Model = model;

exports.Collection = collection;