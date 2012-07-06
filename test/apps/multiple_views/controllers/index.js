var a = require('alloy/components/a').create();

a.setDelegate($);
 
$.t.on('click',function(e) { 
  a.getRoot().open();
});

$.showAlert = function() {
	alert($.t.text);
};

$.index.open();