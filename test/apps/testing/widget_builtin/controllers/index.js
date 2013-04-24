function doClick(e) {
	alert($.label.text);
}

$.index.open();

var anim = require('alloy/animation');

anim.popIn(Ti.UI.createView({
	width : 300,
	height : 300,
	backgroundColor : "red"
}), function(e) {

}); 

alert('as long as there\'s no red screen of death, it\'s working');