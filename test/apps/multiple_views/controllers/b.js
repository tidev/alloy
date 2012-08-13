var C = require('alloy/controllers/c');
var c = new C;

function onReady(args) {
	$.setDelegate = function(o) {
		c.setDelegate(o);
	};
};

function doClick(e) {  
     c.getRoot().open();
};

module.exports = Alloy.getController('BaseController').extend({
	onReady: onReady
});