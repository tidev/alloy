var delegate;

function onReady(args) {
	$.setDelegate = function(o) {
		delegate = o;
	};
};

function doClick(e) {  
     delegate.showAlert();
};

module.exports = Alloy.getController('BaseController').extend({
	onReady: onReady
});