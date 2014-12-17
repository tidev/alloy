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
    this.__controllerPath = "popover_navwin";
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
    $.__views.popover = Ti.UI.iPad.createPopover({
        id: "popover",
        height: "100",
        width: "250"
    });
    $.__views.popover && $.addTopLevelView($.__views.popover);
    $.__views.__alloyId3 = Ti.UI.createWindow({
        title: "Navigation Window",
        id: "__alloyId3"
    });
    $.__views.__alloyId4 = Ti.UI.createLabel({
        text: "Popover with a NavigationWindow",
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    $.__views.popViewNavWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId3,
        id: "popViewNavWin",
        backgroundColor: "green",
        height: "300",
        width: "250"
    });
    $.__views.popover.contentView = $.__views.popViewNavWin;
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;