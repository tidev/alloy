$.index.open();

require('alloy/animation').popIn(Ti.UI.createView({
	width : 300,
	height : 300,
	backgroundColor : 'red'
}), function(e) {});
