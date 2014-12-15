function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function setCurrentTab(e) {
        currentTab = e.index + 1;
    }
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
    var __defers = {};
    $.__views.index = Ti.UI.createTabGroup({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.__alloyId1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        title: "window 1",
        id: "__alloyId1"
    });
    $.__views.__alloyId2 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#111",
        textAlign: "center",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        text: "Label 1",
        id: "__alloyId2"
    });
    $.__views.__alloyId1.add($.__views.__alloyId2);
    $.__views.__alloyId0 = Ti.UI.createTab({
        window: $.__views.__alloyId1,
        title: "tab 1",
        id: "__alloyId0"
    });
    $.__views.index.addTab($.__views.__alloyId0);
    $.__views.__alloyId4 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        title: "window 2",
        id: "__alloyId4"
    });
    $.__views.__alloyId5 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#111",
        textAlign: "center",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        text: "Label 2",
        id: "__alloyId5"
    });
    $.__views.__alloyId4.add($.__views.__alloyId5);
    $.__views.__alloyId3 = Ti.UI.createTab({
        window: $.__views.__alloyId4,
        title: "tab 2",
        id: "__alloyId3"
    });
    $.__views.index.addTab($.__views.__alloyId3);
    $.__views.__alloyId7 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        title: "window 3",
        id: "__alloyId7"
    });
    $.__views.__alloyId8 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#111",
        textAlign: "center",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        text: "Label 3",
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.__alloyId6 = Ti.UI.createTab({
        window: $.__views.__alloyId7,
        title: "tab 3",
        id: "__alloyId6"
    });
    $.__views.index.addTab($.__views.__alloyId6);
    $.__views.index && $.addTopLevelView($.__views.index);
    setCurrentTab ? $.__views.index.addEventListener("focus", setCurrentTab) : __defers["$.__views.index!focus!setCurrentTab"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var currentTab;
    $.index.open();
    __defers["$.__views.index!focus!setCurrentTab"] && $.__views.index.addEventListener("focus", setCurrentTab);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;