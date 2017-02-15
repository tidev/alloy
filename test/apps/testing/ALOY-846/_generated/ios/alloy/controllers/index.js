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
    var __alloyId1 = [];
    if (Alloy.isTablet) {
        $.__views.__alloyId3 = Ti.UI.createWindow({
            id: "__alloyId3"
        });
        $.__views.__alloyId5 = Alloy.createController("testwindow", {
            id: "__alloyId5"
        });
        $.__views.__alloyId4 = Ti.UI.iPhone.createNavigationGroup({
            window: $.__views.__alloyId5.getViewEx({
                recurse: true
            }),
            id: "__alloyId4"
        });
        $.__views.__alloyId3.add($.__views.__alloyId4);
        $.__views.__alloyId6 = Ti.UI.createWindow({
            id: "__alloyId6"
        });
        $.__views.__alloyId7 = Alloy.createController("detailWin", {
            id: "__alloyId7"
        });
        $.__views.detail_navGroup = Ti.UI.iPhone.createNavigationGroup({
            window: $.__views.__alloyId7.getViewEx({
                recurse: true
            }),
            id: "detail_navGroup"
        });
        $.__views.__alloyId6.add($.__views.detail_navGroup);
        $.__views.splitWin = Ti.UI.iOS.createSplitWindow({
            masterView: $.__views.__alloyId3,
            detailView: $.__views.__alloyId6,
            id: "splitWin"
        });
        $.__views.__alloyId2 = Ti.UI.createTab({
            window: $.__views.splitWin,
            title: "Tab 1",
            icon: "KS_nav_ui.png",
            id: "__alloyId2"
        });
        __alloyId1.push($.__views.__alloyId2);
    }
    $.__views.__alloyId9 = Ti.UI.createWindow({
        title: "Tab 2",
        id: "__alloyId9"
    });
    $.__views.__alloyId10 = Ti.UI.createLabel({
        color: "#000",
        text: "I am Window 2",
        id: "__alloyId10"
    });
    $.__views.__alloyId9.add($.__views.__alloyId10);
    $.__views.__alloyId8 = Ti.UI.createTab({
        window: $.__views.__alloyId9,
        title: "Tab 2",
        icon: "KS_nav_views.png",
        id: "__alloyId8"
    });
    __alloyId1.push($.__views.__alloyId8);
    $.__views.index = Ti.UI.createTabGroup({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        tabs: __alloyId1,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.detail_navGroup = $.detail_navGroup;
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;