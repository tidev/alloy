var Alloy = require("alloy"), 
	_ = Alloy._, 
	A$ = Alloy.A;

exports.create = function() {
	var $ = require('baseController').create();

<%= onCreate %>

	// generated from view markup
<%= viewCode %>

	// generated from controller
<%= controllerCode %>

	return $;
};