var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {};

model = Alloy.M("transformer", exports.definition, []);

collection = Alloy.C("transformer", exports.definition, model);

exports.Model = model;

exports.Collection = collection;