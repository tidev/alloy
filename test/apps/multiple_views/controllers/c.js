var delegate;

$.setDelegate = function(o) {
	delegate = o;
};

$.t.on('click',function(e) { 
	delegate.showAlert();
});
