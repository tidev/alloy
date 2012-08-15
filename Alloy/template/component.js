var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	A$ = Alloy.A;

function Controller() {
	require('alloy/controllers/<%= parentController %>').call(this);
	
	var $ = this;
	var exports = {};
	<%= exportsCode %>

	<%= viewCode %>

	// make all IDed in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elemetnts 
	// will be accessed with getView().
	_.extend($, $.__views);

	<%= controllerCode %>

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;