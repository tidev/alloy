var Alloy = require("alloy"),
	$ = Alloy.$,
	_ = Alloy._;

var $w = Ti.UI.createWindow({
	id:"#window"
});

$w.startLayout();

var $index1 = Ti.UI.createView({
	id:"#index"
});

$w.add($index1);

var $label1 = Ti.UI.createLabel();

$index1.add($label1);

// execute the controller inside a function block allowing us to 
// pass in the right scoped variable names for the controller by passing
// in the mangled names thare a local to the function block
(function(window, index){

	var foo = require("foo"),
		bar = require("vendor/bar");

	$("Label")[0].text = bar.helloize(foo.generate());
	
})($w, $index1);



$w.finishLayout();
$w.open();