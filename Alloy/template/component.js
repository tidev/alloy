var Alloy = require('/alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._;

<%= ES6Mod %>
<%= WPATH %>

function __processArg(obj, key) {
	var arg = null;
	if (obj) {
		arg = obj[key] || null;
	}
	return arg;
}

function Controller() {
	<%= Widget %>
	require('/alloy/controllers/' + <%= parentController %>).apply(this, Array.prototype.slice.call(arguments));
	this.__controllerPath = '<%= controllerPath %>';
	this.args = arguments[0] || {};

	if (arguments[0]) {
		var <%= parentVariable %> = __processArg(arguments[0], '<%= parentVariable %>');
		var <%= modelVariable %> = __processArg(arguments[0], '<%= modelVariable %>');
		var <%= itemTemplateVariable %> = __processArg(arguments[0], '<%= itemTemplateVariable %>');
	}
	var $ = this;
	var exports = {};
	var __defers = {};

	// Generated code that must be executed before all UI and/or
	// controller code. One example is all model and collection
	// declarations from markup.
	<%= preCode %>

	// Generated UI code
	<%= viewCode %>

	// make all IDed elements in $.__views available right on the $ in a
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	__MAPMARKER_CONTROLLER_CODE__

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	<%= postCode %>

	// Extend the $ instance with all functions and properties
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;
