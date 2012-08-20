var delegate;

exports.setDelegate = function(o) {
	delegate = o;
};

function doClick(e) {  
     delegate.showAlert();
};