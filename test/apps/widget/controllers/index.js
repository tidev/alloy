var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._;

function controller(args) {
	var $ = this; 

	$.w.setText("Press a button to see something happen");
	$.index.open();
}