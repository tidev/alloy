var _ = require('alloy/underscore')._;

exports.createView = function(args) {
	args = args || {};
	var specialStyle = _.extend({
		backgroundColor: '#111',
		height: '50dp',
		width: '50dp',
		top: '10dp',
		left: '10dp'
	}, args);

	return Ti.UI.createView(specialStyle);
};

exports.createMassiveGreenView = function(args) {
	args = args || {};
	var specialStyle = _.extend({
		backgroundColor: '#0f0',
		height: '200dp',
		width: '200dp',
		top: '10dp',
		left: '10dp'
	}, args);

	return Ti.UI.createView(specialStyle);
};