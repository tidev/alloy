var B = require('alloy/controllers/b');
var b = new B;

function onReady(args) {
	$.setDelegate = function(o) {
		b.setDelegate(o);
	};
};

function doClick(e) {  
     b.getRoot().open();
};

module.exports = Alloy.getController('BaseController').extend({
	onReady: onReady
});