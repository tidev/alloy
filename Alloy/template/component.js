var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	A$ = Alloy.A,
	$;

function Controller() {
	Alloy.getController('BaseController').call(this);
	$ = this;

	<%= viewCode %>

	<%= controllerCode %>
}

module.exports = Controller;

/*
< % = initFunction %>

var __class = init();
__class || (__class = Alloy.getController('BaseController'));

module.exports = __class.extend({
	__init: function() {
		$ = this;
	},
	__layout: function() {
		< % = viewCode %>
	},
	__postLayout: function() {
		< % = controllerCode %>
	}
});
*/