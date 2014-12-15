var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            text: "TEXT"
        },
        adapter: {
            type: "sql",
            collection_name: "collection"
        }
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("collection", exports.definition, [ function(migration) {
    migration.name = "collection";
    migration.id = "201306200000000";
    migration.up = function(migrator) {
        migrator.createTable({
            columns: {
                text: "TEXT"
            }
        });
        for (var i = 0; 20 > i; i++) migrator.insertRow({
            text: "label " + (i + 1)
        });
    };
    migration.down = function(migrator) {
        migrator.dropTable("collection");
    };
} ]);

collection = Alloy.C("collection", exports.definition, model);

exports.Model = model;

exports.Collection = collection;