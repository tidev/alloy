var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	A$ = Alloy.A,
	arguments,
	$;

module.exports = Alloy.getController('BaseController').extend({
	__init: function(args) {
		$ = _.extend(this, $);
		arguments = args;
	},
	preLayout: <%= preLayoutCode %>
	,
	__layout: function() {
		<%= viewCode %>
	},
	__postLayout: function() {
		<%= controllerCode %>
	}
});