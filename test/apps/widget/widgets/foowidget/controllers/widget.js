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

// anything defined against exports will be exposed as methods/properties 
// on any instance of the widget
exports.setText = function(text){
	$.t.text = text;
};

exports.getText = function() {
	return $.t.text;
}
