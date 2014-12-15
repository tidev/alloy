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
    if (Alloy.isTablet) {
        $.__views.__alloyId1 = Ti.UI.createWindow({
            title: "Main Window",
            id: "__alloyId1"
        });
        $.__views.__alloyId2 = Ti.UI.createLabel({
            text: "I am the master view",
            id: "__alloyId2"
        });
        $.__views.__alloyId1.add($.__views.__alloyId2);
        $.__views.__alloyId0 = Ti.UI.iOS.createNavigationWindow({
            window: $.__views.__alloyId1,
            id: "__alloyId0"
        });
        $.__views.__alloyId4 = Ti.UI.createWindow({
            title: "Detail Window",
            id: "__alloyId4"
        });
        $.__views.__alloyId5 = Ti.UI.createLabel({
            text: "I am the detail view.",
            id: "__alloyId5"
        });
        $.__views.__alloyId4.add($.__views.__alloyId5);
        $.__views.__alloyId3 = Ti.UI.iOS.createNavigationWindow({
            window: $.__views.__alloyId4,
            id: "__alloyId3"
        });
        $.__views.index = Ti.UI.iPad.createSplitWindow({
            backgroundColor: "#fff",
            fullscreen: false,
            exitOnClose: true,
            masterView: $.__views.__alloyId0,
            detailView: $.__views.__alloyId3,
            id: "index"
        });
        $.__views.index && $.addTopLevelView($.__views.index);
    }
    if (!Alloy.isTablet) {
        $.__views.index = Ti.UI.createWindow({
            backgroundColor: "#fff",
            fullscreen: false,
            exitOnClose: true,
            id: "index"
        });
        $.__views.index && $.addTopLevelView($.__views.index);
        $.__views.__alloyId6 = Ti.UI.createLabel({
            text: "This app is only supported on iPad",
            id: "__alloyId6"
        });
        $.__views.index.add($.__views.__alloyId6);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;