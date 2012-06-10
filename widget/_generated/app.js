var Alloy = require("alloy");

var $w = Ti.UI.createWindow({
	id: "#w"
});
$w.startLayout();

var $index1 = Ti.UI.createView({
	backgroundColor:"blue",
	id:"#index"
});


$w.add($index1);

// generate widget code, but make sure we prefix ids with widgets id
var $w1 = Ti.UI.createView({
	id: "#w"
});

var $w1_$t1 = Ti.UI.createLabel({
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	width : Ti.UI.FIT,
	height: Ti.UI.FIT,
	text: "Click a button to display something",
	color: "blue",		// <--- NOTE: we overode the widgets default style in our index.json 
	id: "#w:#t"
});

$w1.add($w1_$t1);

var $w1_$hl1 = Ti.UI.createLabel({
	layout:"horizontal",
	width : Ti.UI.FILL,
	height : "100",
	id:"#w:#hl"
});

$w1.add($w1_$hl1);

var $w1_$a1 = Ti.UI.createButton({
	text: "A",
	width : Ti.UI.FIT,
	height : Ti.UI.FIT,
	id:"#w:#a"
});

$w1_$hl1.add($w1_$a1);

var $w1_$b1 = Ti.UI.createButton({
	text: "B",
	width : Ti.UI.FIT,
	height : Ti.UI.FIT,
	id:"#w:#b"
});

$w1_$hl1.add($w1_$b1);

var $w1_$c1 = Ti.UI.createButton({
	text: "C",
	width : Ti.UI.FIT,
	height : Ti.UI.FIT,
	id:"#w:#c"
});

$w1_$hl1.add($w1_$c1);

$index1.add($w1);


// create a widget and load the widget and export any variables, acting like a common JS module
// pass all variables
var $$widget1 = (function(exports, widget, t, hl, a, b, c, t){
	
	// code that comes from the widget.js
	
	a.addEventListener('click',function(){
		t.text = "You clicked A";
	});

	b.addEventListener('click',function(){
		t.text = "You clicked B";
	});

	c.addEventListener('click',function(){
		t.text = "You clicked C";
	});


	exports.setText = function(text){
		t.text = text;
	};

	exports.getText = function() {
		return t.text;
	}
	
	// generate the widget property assignments so that the importer of the widget can use them if needed
	exports.widget = widget; // the widgets view container
	exports.t = t;
	exports.hl = hl;
	exports.a = a;
	exports.b = b;
	exports.c = c;
	
	// generate the run exports so we can assign the exports back into the widget variable
	return exports;
	
})({}, $w1, $w1_$t1, $w1_$hl1, $w1_$a1, $w1_$b1, $w1_$c1);


// execute the controller inside a function block allowing us to 
// pass in the right scoped variable names for the controller by passing
// in the mangled names thare a local to the function block
(function(window, index, w){

	w.setText("Press a button to see something happen");

})($w, $index1, $$widget1);



$w.finishLayout();
$w.open();