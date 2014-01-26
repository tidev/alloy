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
            _.extend(o, {});
            Alloy.isHandheld && _.extend(o, {
                backgroundColor: "blue"
            });
            _.extend(o, {});
            Alloy.isTablet && _.extend(o, {
                backgroundColor: "red"
            });
            _.extend(o, {
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
            _.extend(o, {});
            Alloy.isHandheld && _.extend(o, {
                backgroundColor: "blue"
            });
            _.extend(o, {});
            Alloy.isTablet && _.extend(o, {
                backgroundColor: "red"
            });
            _.extend(o, {
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
        _.extend(o, {});
        Alloy.isHandheld && _.extend(o, {
            backgroundColor: "blue"
        });
        _.extend(o, {});
        Alloy.isTablet && _.extend(o, {
            backgroundColor: "red"
        });
        _.extend(o, {
            id: "container",
            height: "50",
            width: "200",
            bottom: "10",
            backgroundColor: "#cdcdcd"
        });
        return o;
    }());
    $.__views.index.add($.__views.container);
    if (true && Alloy.isTablet) {
        $.__views.platformLabel = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "blackberry tablet",
            id: "platformLabel"
        });
        $.__views.container.add($.__views.platformLabel);
    }
    if (true && !Alloy.isTablet) {
        $.__views.platformLabel = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "blackberry handheld",
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

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;