var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._;

function controller(args) {
	var $ = this; 

	// add listeners for widget buttons
	$.a.addEventListener('click',function(){
		$.t.text = "You clicked A";
	});

	$.b.addEventListener('click',function(){
		$.t.text = "You clicked B";
	});

	$.c.addEventListener('click',function(){
		$.t.text = "You clicked C";
	});

	// anything defined against the $ will be exposed as methods/properties 
	$.setText = function(text){
		$.t.text = text;
	};

	$.getText = function() {
		return $.t.text;
	}
}
