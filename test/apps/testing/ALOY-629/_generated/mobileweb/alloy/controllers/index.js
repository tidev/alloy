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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.notes = Ti.UI.createLabel({
        top: 10,
        left: 15,
        right: 15,
        height: Ti.UI.SIZE,
        textAlign: "left",
        color: "#000",
        font: {
            fontSize: 14,
            fontWeight: "normal"
        },
        text: 'Below you should see a red box with a rounded black border and white bold text inside. On iOS, it should say "global merging is working!" with a gray drop shadow. On all other platforms, it should say "you should only see this on non-iOS builds" with no drop shadow.',
        id: "notes"
    });
    $.__views.index.add($.__views.notes);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: 24,
            fontWeight: "bold"
        },
        bottom: 15,
        height: 120,
        width: 300,
        textAlign: "center",
        text: "you should only see this on non-iOS builds",
        backgroundColor: "#a00",
        borderWidth: 2,
        borderRadius: 8,
        borderColor: "#000",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;