var Alloy = require("/alloy"), _ = require("/alloy/underscore")._, model, collection;

exports.definition = {};

model = Alloy.M("modelb", exports.definition, []);

collection = Alloy.C("modelb", exports.definition, model);

exports.Model = model;

exports.Collection = collection;