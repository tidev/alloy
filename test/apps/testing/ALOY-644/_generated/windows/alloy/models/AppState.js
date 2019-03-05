var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        defaults: {
            counter: 1,
            color: "#00f"
        }
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("appState", exports.definition, []);

collection = Alloy.C("appState", exports.definition, model);

exports.Model = model;

exports.Collection = collection;