var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            transform: function() {
                var transformed = this.toJSON();
                transformed.foo = transformed.foo + "D!";
                transformed.bar = transformed.bar + "T!";
                return transformed;
            }
        });
        return Model;
    }
};

model = Alloy.M("transformer", exports.definition, []);

collection = Alloy.C("transformer", exports.definition, model);

exports.Model = model;

exports.Collection = collection;