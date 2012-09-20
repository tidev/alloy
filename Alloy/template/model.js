
<%= modelJs %>


var Alloy = require('alloy'),
    _ = require("alloy/underscore")._,
	model, collection;

model = Alloy.M('<%= basename %>',
	 exports.definition,
	[<%= migrations %>]
);

collection = Alloy.C('<%= basename %>',
	 exports.definition, 
	 model
);

exports.Model = model;
exports.Collection = collection;