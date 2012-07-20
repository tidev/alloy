var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel({
	color: '#000',
	font: {
		fontSize: '64dp',
		fontWeight: 'bold'	
	}	
});
win.add(label);
win.open();

var req = require('ti.physicalSizeCategory');
Ti.API.info("module is => " + req);
Ti.API.info("physicalSizeCategory: " + req.physicalSizeCategory);
label.text = req.physicalSizeCategory;


