var Alloy = require("alloy"),
	$ = Alloy.$,
	_ = Alloy._;

var $w = Ti.UI.createWindow({
	id:"#window"
});

$w.startLayout();

var $index1 = Ti.UI.createView({
	backgroundColor:"blue",
	id:"#index"
});

var $b1 = Ti.UI.createView({
	width : Ti.UI.FIT,
	height : Ti.UI.FIT,
	text : "Hello, World",
	id:"#b"
});
$index1.add($b1);

$w.add($index1);

// execute the controller inside a function block allowing us to 
// pass in the right scoped variable names for the controller by passing
// in the mangled names thare a local to the function block
(function(window, index, b){

	// this would be the code that was present in the controller and all variables 
	// would be passed in that are defined in the view by the 'id' attribute
	b.addEventListener("click",function(e){
		alert("Click!");
	});
	
})($w, $index1,$b1);



$w.finishLayout();
$w.open();