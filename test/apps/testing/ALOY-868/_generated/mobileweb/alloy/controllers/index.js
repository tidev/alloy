function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __alloyId0 = [];
    $.__views.index = Ti.UI.createWindow({
        id: "index",
        backgroundColor: "#fff"
    });
    $.__views.__alloyId2 = Alloy.createController("next", {
        id: "__alloyId2",
        __parentSymbol: $.__views.index
    });
    $.__views.__alloyId2.setParent($.__views.index);
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.index,
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;