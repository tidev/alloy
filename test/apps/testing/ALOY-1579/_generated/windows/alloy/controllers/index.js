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

	$.__views.index = Ti.UI.createWindow({ backgroundColor: "#fff", fullscreen: false, exitOnClose: true, id: "index" });
	$.__views.index && $.addTopLevelView($.__views.index);
	$.__views.drawer = Ti.UI.Android.createDrawerLayout({ id: "drawer" });
	$.__views.index.add($.__views.drawer);
	$.__views.__alloyId2 = Ti.UI.createView({ backgroundColor: "yellow", id: "__alloyId2" });
	$.__views.__alloyId3 = Ti.UI.createButton({ title: 'RIGHT', id: "__alloyId3" });
	$.__views.__alloyId2.add($.__views.__alloyId3);
	doButtonClick ? $.addListener($.__views.__alloyId3, 'click', doButtonClick) : __defers['$.__views.__alloyId3!click!doButtonClick'] = true;$.__views.drawer.centerView = $.__views.__alloyId2;$.__views.__alloyId5 = Ti.UI.createView({ backgroundColor: "orange", id: "__alloyId5" });
	$.__views.drawer.rightView = $.__views.__alloyId5;exports.destroy = function () {};

	_.extend($, $.__views);

	function doButtonClick(e) {
		$.drawer.toggleRight();
	}

	function doHomeIcon(e) {
		$.drawer.toggleLeft();
	}

	$.index.open();

	__defers['$.__views.__alloyId3!click!doButtonClick'] && $.addListener($.__views.__alloyId3, 'click', doButtonClick);

	_.extend($, exports);
}

module.exports = Controller;