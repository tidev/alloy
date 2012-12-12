var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	A$ = Alloy.A,
	<%= modelVariable %>;

<%= WPATH %>

function Controller() {
	require('alloy/controllers/' + <%= parentController %>).apply(this, Array.prototype.slice.call(arguments));
	
	<%= modelVariable %> = arguments[0] ? arguments[0]['<%= modelVariable %>'] : null;
	var $ = this;
	var exports = {};
	
	// Generated code that must be executed before all UI and/or
	// controller code. One example in all model and collection 
	// declarations from markup.
	<%= preCode %>

	// Generated UI code
	<%= viewCode %>

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	<%= controllerCode %>

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;