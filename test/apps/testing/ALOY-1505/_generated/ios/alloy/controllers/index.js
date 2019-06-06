var Alloy = require('/alloy'),
Backbone = Alloy.Backbone,
_ = Alloy._;




function __processArg(obj, key) {
	var arg = null;
	if (obj) {
		arg = obj[key] || null;
	}
	return arg;
}

function Controller() {

	require('/alloy/controllers/' + 'BaseController').apply(this, Array.prototype.slice.call(arguments));
	this.__controllerPath = 'index';
	this.args = arguments[0] || {};

	if (arguments[0]) {
		var __parentSymbol = __processArg(arguments[0], '__parentSymbol');
		var $model = __processArg(arguments[0], '$model');
		var __itemTemplate = __processArg(arguments[0], '__itemTemplate');
	}
	var $ = this;
	var exports = {};
	var __defers = {};







	$.__views.index = Ti.UI.createWindow(
	{ backgroundColor: "#fff", fullscreen: false, exitOnClose: true, id: "index" });

	$.__views.index && $.addTopLevelView($.__views.index);
	var __alloyId0 = undefined;var __alloyId1 = undefined;var __alloyId3 = [];__alloyId3.push("Confirm");if (true) {
		__alloyId3.push("Help");}
	__alloyId0 = __alloyId3.push("Cancel") - 1;$.__views.dialog = Ti.UI.createOptionDialog(
	{ options: __alloyId3, cancel: __alloyId0, destructive: __alloyId1, id: "dialog", title: "Delete File?" });

	exports.destroy = function () {};




	_.extend($, $.__views);


	$.index.open();









	_.extend($, exports);
}

module.exports = Controller;