var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function preLayout(args) {
	$ = this;
}

function postLayout(args) { 
	$.win.open();
}
