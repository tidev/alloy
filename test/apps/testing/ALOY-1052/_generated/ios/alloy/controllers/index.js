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
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: "25dp",
        color: "#000",
        font: {
            fontSize: 12
        },
        text: L("foo"),
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: "25dp",
        color: "#000",
        font: {
            fontSize: 12
        },
        text: "TabbedBar",
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    var __alloyId3 = [];
    var __alloyId7 = {
        title: "L(foo)"
    };
    __alloyId3.push(__alloyId7);
    var __alloyId8 = {
        title: L("foo")
    };
    __alloyId3.push(__alloyId8);
    var __alloyId9 = {
        title: L("foo")
    };
    __alloyId3.push(__alloyId9);
    $.__views.tb = Ti.UI.iOS.createTabbedBar({
        labels: __alloyId3,
        id: "tb"
    });
    $.__views.index.add($.__views.tb);
    $.__views.__alloyId10 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: "25dp",
        color: "#000",
        font: {
            fontSize: 12
        },
        text: "ButtonBar",
        id: "__alloyId10"
    });
    $.__views.index.add($.__views.__alloyId10);
    var __alloyId12 = [];
    var __alloyId16 = {
        title: "L(foo)"
    };
    __alloyId12.push(__alloyId16);
    var __alloyId17 = {
        title: L("foo")
    };
    __alloyId12.push(__alloyId17);
    var __alloyId18 = {
        title: L("foo")
    };
    __alloyId12.push(__alloyId18);
    $.__views.bb = Ti.UI.createButtonBar({
        labels: __alloyId12,
        id: "bb"
    });
    $.__views.index.add($.__views.bb);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;