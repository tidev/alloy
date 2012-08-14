var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	A$ = Alloy.A;

function Controller() {
	require('alloy/controllers/<%= parentController %>').call(this);
	
	var exports, $;
	exports = $ = this;

	<%= viewCode %>

	<%= exportsCode %>

	<%= controllerCode %>
}

module.exports = Controller;