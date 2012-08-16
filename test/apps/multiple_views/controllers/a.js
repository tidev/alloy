var controller = Alloy.getController('b');

exports.setDelegate = function(o) {
	controller.setDelegate(o);
};
	
exports.showAlert = function() {
	alert($.t.text);
};

function doClick(e) {  
     controller.getUIRoot().open();
};