function postLayout(args) {
	var foo = require("foo"),
		bar = require("vendor/bar");

	Ti.API.info(bar.helloize(foo.generate()));

	$.index.open();
}
