var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	A$ = Alloy.A,
	$;

function Controller() {
	require('alloy/controllers/<%= parentController %>').call(this);
	$ = this;

	<%= viewCode %>

	<%= controllerCode %>

	<%= exportsCode %>
}

module.exports = Controller;