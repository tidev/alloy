var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function init(args) {
	$ = this;
}

function controller(args) {
	$.thumbnail.image = args.image;
	$.title.text = args.title || '';
	$.authors.text = args.authors || '';
}