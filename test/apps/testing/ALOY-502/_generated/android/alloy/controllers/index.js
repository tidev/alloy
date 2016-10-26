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
    var __alloyId1 = [];
    $.__views.__alloyId3 = Alloy.createWidget("alloy.window", "widget", {
        id: "__alloyId3"
    });
    $.__views.__alloyId2 = Ti.UI.createTab({
        window: $.__views.__alloyId3.getViewEx({
            recurse: true
        }),
        title: "tab 1",
        id: "__alloyId2"
    });
    __alloyId1.push($.__views.__alloyId2);
    $.__views.__alloyId6 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        title: "window 2",
        id: "__alloyId6"
    });
    $.__views.__alloyId7 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#000",
        textAlign: "center",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        text: "label 2",
        id: "__alloyId7"
    });
    $.__views.__alloyId6.add($.__views.__alloyId7);
    $.__views.__alloyId5 = Ti.UI.createTab({
        window: $.__views.__alloyId6,
        title: "tab 2",
        id: "__alloyId5"
    });
    __alloyId1.push($.__views.__alloyId5);
    $.__views.index = Ti.UI.createTabGroup({
        backgroundColor: "#fff",
        tabs: __alloyId1,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;