

a.addEventListener('click',function(){
	t.text = "You clicked A";
});

b.addEventListener('click',function(){
	t.text = "You clicked B";
});

c.addEventListener('click',function(){
	t.text = "You clicked C";
});


// anything defined against the export will be provided as methods/properties against the widgets variable

exports.setText = function(text){
	t.text = text;
};

exports.getText = function() {
	return t.text;
}