function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        backgroundColor: "#f00",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.osLabel = Ti.UI.createLabel(function() {
        var o = {};
        Alloy.deepExtend(true, o, {
            color: "#fff",
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            textAlign: "center",
            font: {
                fontSize: 48,
                fontWeight: "bold"
            }
        });
        Alloy.isTablet && Alloy.deepExtend(true, o, {
            font: {
                fontSize: 96,
                fontWeight: "bold"
            }
        });
        Alloy.deepExtend(true, o, {
            text: "iOS device\n(size unknown)"
        });
        Alloy.isTablet && Alloy.deepExtend(true, o, {
            text: "iPad"
        });
        Alloy.isHandheld && Alloy.deepExtend(true, o, {
            text: "iPhone"
        });
        Alloy.deepExtend(true, o, {
            id: "osLabel"
        });
        return o;
    }());
    $.__views.win.add($.__views.osLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.win.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;