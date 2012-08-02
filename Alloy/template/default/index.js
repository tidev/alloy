var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

function init(args) {
	$ = this;
}

function controller(args) {
	$.t.on('click',function(e) { 
		alert($.t.text);
	});

	$.index.open();
}