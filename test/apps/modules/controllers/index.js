var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function preLayout(args) {
	$ = this;
}

function postLayout(args) {
	var foo = require("foo"),
		bar = require("vendor/bar");

	Ti.API.info(bar.helloize(foo.generate()));

	$.index.open();
}
