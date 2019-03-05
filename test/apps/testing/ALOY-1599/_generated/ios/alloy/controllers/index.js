var Alloy = require('/alloy'),
Backbone = Alloy.Backbone,
_ = Alloy._;




function __processArg(obj, key) {
	var arg = null;
	if (obj) {
		arg = obj[key] || null;
		delete obj[key];
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




	Alloy.Models.instance('Big');Alloy.Models.instance('small');


	$.__views.index = Ti.UI.createWindow(
	{ backgroundColor: "#fff", layout: "vertical", exitOnClose: true, fullscreen: false, id: "index" });

	$.__views.index && $.addTopLevelView($.__views.index);
	$.__views.lbl1 = Ti.UI.createLabel(
	{ id: "lbl1" });

	$.__views.index.add($.__views.lbl1);
	$.__views.lbl2 = Ti.UI.createLabel(
	{ id: "lbl2" });

	$.__views.index.add($.__views.lbl2);
	var __alloyId4 = function () {Alloy['Models']['Big'].__transform = _.isFunction(Alloy['Models']['Big'].transform) ? Alloy['Models']['Big'].transform() : Alloy['Models']['Big'].toJSON();$.lbl1.text = Alloy['Models']['Big']['__transform']['name'];};Alloy['Models']['Big'].on('fetch change destroy', __alloyId4);var __alloyId5 = function () {Alloy['Models']['small'].__transform = _.isFunction(Alloy['Models']['small'].transform) ? Alloy['Models']['small'].transform() : Alloy['Models']['small'].toJSON();$.lbl2.text = Alloy['Models']['small']['__transform']['name'];};Alloy['Models']['small'].on('fetch change destroy', __alloyId5);exports.destroy = function () {Alloy['Models']['Big'] && Alloy['Models']['Big'].off('fetch change destroy', __alloyId4);Alloy['Models']['small'] && Alloy['Models']['small'].off('fetch change destroy', __alloyId5);};




	_.extend($, $.__views);


	Alloy.Models.instance("Big").set({ name: "Big!" });
	Alloy.Models.instance("small").set({ name: "small!" });

	$.index.open();









	_.extend($, exports);
}

module.exports = Controller;