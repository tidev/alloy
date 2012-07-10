var Alloy = require('alloy'),
	model, collection;

model = Alloy.M('<%= basename %>',
	<%= modelConfig %>,
	function(<%= basename %>) {
		<%= modelJs %>
	},
	[<%= migrations %>]
);
collection = Alloy.Backbone.Collection.extend({model:model});
collection.prototype.config = model.prototype.config;

exports.Model = model;
exports.Collection = collection;