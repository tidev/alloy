var controller = Alloy.getController('a');
controller.setDelegate($);
	
exports.showAlert = function() {
	alert($.t.text);
};

function doClick(e) {  
     controller.getView().open();
};

$.index.open();