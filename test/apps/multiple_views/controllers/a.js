var b = require('alloy/components/b').create();

$.setDelegate = function(o) {
	b.setDelegate(o);
};

$.t.on('click',function(e) { 
	b.getRoot().open();
});



