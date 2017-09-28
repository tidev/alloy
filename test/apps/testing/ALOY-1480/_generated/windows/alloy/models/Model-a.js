var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            transform: function() {
                var transformed = this.toJSON();
                transformed.subject && (transformed.subject = transformed.subject.toUpperCase());
                transformed.font = {
                    fontSize: 20,
                    fontWeight: "bold"
                };
                return transformed;
            }
        });
        return Model;
    }
};

model = Alloy.M("model-a", exports.definition, []);

collection = Alloy.C("model-a", exports.definition, model);

exports.Model = model;

exports.Collection = collection;