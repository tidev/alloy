var c = require('alloy/components/c').create();

$.setDelegate = function(o) {
	c.setDelegate(o);
};

$.t.on('click',function(e) { 
	c.getRoot().open();
});

