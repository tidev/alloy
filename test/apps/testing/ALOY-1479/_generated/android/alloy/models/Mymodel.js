var Alloy = require("/alloy"), _ = require("/alloy/underscore")._, model, collection;

exports.definition = {};

model = Alloy.M("mymodel", exports.definition, []);

collection = Alloy.C("mymodel", exports.definition, model);

exports.Model = model;

exports.Collection = collection;