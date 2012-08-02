var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function preLayout(args) {
	$ = this;
}

function postLayout(args) {
	Ti.API.info('bottom controller is executing');
}
