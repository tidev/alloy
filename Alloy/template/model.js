var Alloy = require('alloy'),
	model, collection;

var S4 = function (){
	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

var guid = 	function () {
	   return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
};

<%= modeldefinition %>

object = Alloy.M('<%= basename %>',
	configuration,
	model,
	collection,
	[<%= migrations %>]
);

model = object.model;
collection = object.collection;

model.prototype.generateguid =guid;
collection.prototype.generateguid =guid;

collection = collection.extend({model:model});
exports.Model = model;
exports.Collection = collection;




