var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function preLayout(args) {
	$ = this;
}

function postLayout(args) {
	$.thumbnail.image = args.image;
	$.title.text = args.title || '';
	$.authors.text = args.authors || '';
}