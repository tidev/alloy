var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function init(args) {
	$ = this;
}

function controller(args) {
	$.id = $.row.id = args.id;
	$.name.text = args.name || '<no name>';
	$.score.text = args.score || 0;
}