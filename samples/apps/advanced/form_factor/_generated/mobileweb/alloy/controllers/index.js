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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    if (!Alloy.isTablet) {
        $.__views.main = Ti.UI.createView(function() {
            var o = {};
            Alloy.isHandheld && Alloy.deepExtend(true, o, {
                backgroundColor: "blue"
            });
            Alloy.isTablet && Alloy.deepExtend(true, o, {
                backgroundColor: "red"
            });
            Alloy.deepExtend(true, o, {
                id: "main"
            });
            return o;
        }());
        $.__views.index.add($.__views.main);
        $.__views.label = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "I'm a handheld!",
            id: "label"
        });
        $.__views.main.add($.__views.label);
    }
    if (Alloy.isTablet) {
        $.__views.main = Ti.UI.createView(function() {
            var o = {};
            Alloy.isHandheld && Alloy.deepExtend(true, o, {
                backgroundColor: "blue"
            });
            Alloy.isTablet && Alloy.deepExtend(true, o, {
                backgroundColor: "red"
            });
            Alloy.deepExtend(true, o, {
                id: "main"
            });
            return o;
        }());
        $.__views.index.add($.__views.main);
        $.__views.label = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "I'm a tablet!",
            id: "label"
        });
        $.__views.main.add($.__views.label);
    }
    $.__views.container = Ti.UI.createView(function() {
        var o = {};
        Alloy.isHandheld && Alloy.deepExtend(true, o, {
            backgroundColor: "blue"
        });
        Alloy.isTablet && Alloy.deepExtend(true, o, {
            backgroundColor: "red"
        });
        Alloy.deepExtend(true, o, {
            id: "container",
            height: 50,
            width: 200,
            bottom: 10,
            backgroundColor: "#cdcdcd"
        });
        return o;
    }());
    $.__views.index.add($.__views.container);
    if (Alloy.isTablet) {
        $.__views.platformLabel = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "mobileweb tablet",
            id: "platformLabel"
        });
        $.__views.container.add($.__views.platformLabel);
    }
    if (!Alloy.isTablet) {
        $.__views.platformLabel = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "mobileweb handheld",
            id: "platformLabel"
        });
        $.__views.container.add($.__views.platformLabel);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;