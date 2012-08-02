var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._;

function init(args) {
	$ = this;
	if (ENV_DEV) { alert('development mode'); }
}

function controller(args) {
	function showAlert() {
    	alert("Click! Shouldn't do it again though");
    	$.b.off("click",showAlert);
	}
	$.b.on("click",showAlert);

	$.index.open();
}