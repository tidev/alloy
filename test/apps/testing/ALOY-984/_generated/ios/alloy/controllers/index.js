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
    $.__views.__alloyId0 = Ti.UI.createWindow({
        title: "NavButtons",
        id: "__alloyId0"
    });
    var leftNavButtons = [];
    $.__views.__alloyId2 = Ti.UI.createView({
        width: "25",
        height: "25",
        backgroundColor: "red",
        id: "__alloyId2"
    });
    leftNavButtons.push($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createView({
        width: "25",
        height: "25",
        backgroundColor: "green",
        id: "__alloyId3"
    });
    leftNavButtons.push($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createView({
        width: "25",
        height: "25",
        backgroundColor: "blue",
        id: "__alloyId4"
    });
    leftNavButtons.push($.__views.__alloyId4);
    $.__views.__alloyId0.leftNavButtons = leftNavButtons;
    var rightNavButtons = [];
    $.__views.__alloyId6 = Ti.UI.createButton({
        title: "B1",
        id: "__alloyId6"
    });
    rightNavButtons.push($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createButton({
        title: "B2",
        id: "__alloyId7"
    });
    rightNavButtons.push($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createButton({
        title: "B3",
        id: "__alloyId8"
    });
    rightNavButtons.push($.__views.__alloyId8);
    $.__views.__alloyId0.rightNavButtons = rightNavButtons;
    $.__views.__alloyId9 = Ti.UI.createLabel({
        text: "The window should have three colored views on the left, and three buttons on the right, of the NavigationBar.",
        id: "__alloyId9"
    });
    $.__views.__alloyId0.add($.__views.__alloyId9);
    $.__views.index = Ti.UI.iOS.createNavigationWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        window: $.__views.__alloyId0,
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