var a = require('alloy/components/a').create();

a.setDelegate(this);
 
$.t.on('click',function(e) { 
  a.getRoot().open();
});

exports.showAlert = function() {
	alert($.t.text);
};

$.index.open();