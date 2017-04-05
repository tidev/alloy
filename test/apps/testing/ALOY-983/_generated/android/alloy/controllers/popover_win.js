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
    this.__controllerPath = "popover_win";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.popover = Ti.UI.iPad.createPopover({
        id: "popover",
        height: 100,
        width: 250
    });
    $.__views.popover && $.addTopLevelView($.__views.popover);
    $.__views.popViewWin = Ti.UI.createWindow({
        id: "popViewWin",
        backgroundColor: "green",
        height: 100,
        width: 250
    });
    $.__views.__alloyId6 = Ti.UI.createLabel({
        text: "Popover with a Window",
        id: "__alloyId6"
    });
    $.__views.popViewWin.add($.__views.__alloyId6);
    $.__views.popover.contentView = $.__views.popViewWin;
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;