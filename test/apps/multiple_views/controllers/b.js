var controller = Alloy.getController('c');

exports.setDelegate = function(o) {
	controller.setDelegate(o);
};
	
exports.showAlert = function() {
	alert($.t.text);
};

function doClick(e) {  
     controller.getView().open();
};