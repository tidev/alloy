var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {},
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("empty", exports.definition, []);

collection = Alloy.C("empty", exports.definition, model);

exports.Model = model;

exports.Collection = collection;