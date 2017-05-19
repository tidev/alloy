var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("heroes", exports.definition, []);

collection = Alloy.C("heroes", exports.definition, model);

exports.Model = model;

exports.Collection = collection;