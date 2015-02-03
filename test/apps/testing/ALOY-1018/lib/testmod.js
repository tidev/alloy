var CustomButton = function(args) {
	var btn = Ti.UI.createButton({
		title: 'Button',
		color: 'black',
		borderWidth: args.borderWidth || 5,
		width: Ti.UI.FILL,
		borderColor: OS_IOS ? 'blue' : 'green'
	});
	btn.applyProperties(args);
	return btn;
};
exports.createCustomButton = function(args) {
	return new CustomButton(args);
};

var CustomLabel = function(args) {
	var lbl = Ti.UI.createLabel({
		text: 'Label',
		color: 'black',
		bottom: 50,
		font: {
			fontSize: '20dp'
		},
		backgroundColor: 'pink'
	});
	lbl.applyProperties(args);
	return lbl;
};
exports.createCustomLabel = function(args) {
	return new CustomLabel(args);
};
