var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._;

function controller(args) {
	var $ = this; 

	function showAlert() {
    	alert("Click! Shouldn't do it again though");
    	$.b.off("click",showAlert);
	}
	$.b.on("click",showAlert);

	$.index.open();
}

function beforeLayout(args) {
	if (ENV_DEV) { alert('development mode'); }
}