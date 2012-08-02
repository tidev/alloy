var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function init(args) {
	$ = this;
}

function controller(args) {
	var foo = require("foo"),
		bar = require("vendor/bar");

	Ti.API.info(bar.helloize(foo.generate()));

	$.index.open();
}