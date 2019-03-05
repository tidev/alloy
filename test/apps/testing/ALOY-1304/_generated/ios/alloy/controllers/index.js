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
	{ backgroundColor: "#fff", fullscreen: false, exitOnClose: true, layout: "vertical", id: "index" });

	$.__views.index && $.addTopLevelView($.__views.index);
	$.__views.__alloyId0 = Ti.UI.createLabel(
	{ text: 'Hello', top: 20, width: 100, backgroundColor: "#ccc", id: "__alloyId0" });

	$.__views.index.add($.__views.__alloyId0);
	$.__views.__alloyId1 = Ti.UI.createLabel(
	{ text: L('hello_world'), id: "__alloyId1" });

	$.__views.index.add($.__views.__alloyId1);
	$.__views.__alloyId2 = Ti.UI.createLabel(
	{ text: L('hello_world'), id: "__alloyId2" });

	$.__views.index.add($.__views.__alloyId2);
	$.__views.__alloyId3 = Ti.UI.createTextField(
	{ value: 'Hello', top: 20, width: 100, backgroundColor: "#ccc", id: "__alloyId3" });

	$.__views.index.add($.__views.__alloyId3);
	$.__views.__alloyId4 = Ti.UI.createTextField(
	{ value: L('hello_world'), id: "__alloyId4" });

	$.__views.index.add($.__views.__alloyId4);
	$.__views.__alloyId5 = Ti.UI.createTextField(
	{ value: L('hello_world'), id: "__alloyId5" });

	$.__views.index.add($.__views.__alloyId5);
	$.__views.__alloyId6 = Ti.UI.createTextArea(
	{ value: 'Hello', top: 20, width: 100, backgroundColor: "#ccc", id: "__alloyId6" });

	$.__views.index.add($.__views.__alloyId6);
	$.__views.__alloyId7 = Ti.UI.createTextArea(
	{ value: L('hello_world'), id: "__alloyId7" });

	$.__views.index.add($.__views.__alloyId7);
	$.__views.__alloyId8 = Ti.UI.createTextArea(
	{ value: L('hello_world'), id: "__alloyId8" });

	$.__views.index.add($.__views.__alloyId8);
	exports.destroy = function () {};




	_.extend($, $.__views);


	$.index.open();









	_.extend($, exports);
}

module.exports = Controller;