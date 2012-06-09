
var $w = Ti.UI.createWindow({
	id: "#w"
});
$w.startLayout();

var $index1 = Ti.UI.createView({
	backgroundColor:"blue",
	id:"#index"
});

var $top1 = Ti.UI.createView({
	id:"#top"
});

var $middle1 = Ti.UI.createView({
	backgroundColor:"red",
	id:"#middle"
});

var $bottom1 = Ti.UI.createView({
	id:"#bottom"
});

var $label1 = Ti.UI.createLabel({
	width: Ti.UI.FILL,
	height:Ti.UI.FIT,
	color: "yellow",
	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	id: "#t"
});

$middle1.add($label1);

var $button1 = Ti.UI.createButton({
	width: Ti.UI.FIT,
	height: Ti.UI.FIT,
	text : "Click me",
	id: "#b"
});

$bottom1.add($button1);

$index1.add($top1);
$index1.add($middle1);
$index1.add($bottom1);

// execute the controller inside a function block allowing us to 
// pass in the right scoped variable names for the controller by passing
// in the mangled names thare a local to the function block
(function(window, index, top, middle, t, bottom, b){

	top.updateLayout({
		backgroundColor:"black",
		borderRadius:2,
		borderColor:"blue",
		height:100
	});

	b.addEventListener('click',function(){
		t.text = "You clicked me";
	});
	
})($w, $index1, $top1, $middle1, $label1, $bottom1, $button1);



$w.finishLayout();
$w.open();