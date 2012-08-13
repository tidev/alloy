var A = require('alloy/controllers/a');
var a = new A;
 
 function onReady(args) {
	a.setDelegate($);
	
	$.showAlert = function() {
		alert($.t.text);
	};
	
	$.index.open();
};

function doClick(e) {  
     a.getRoot().open();
};

module.exports = Alloy.getController('BaseController').extend({
	onReady: onReady
});
