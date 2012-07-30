var Alloy = require("alloy"), 
	_ = Alloy._, 
	A$ = Alloy.A;

exports.create = function() {
	var $ = require('baseComponent').create();

<%= onCreate %>

	// generated from view markup
<%= viewCode %>

	// generated from controller
<%= controllerCode %>

	return $;
};