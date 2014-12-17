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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#eee",
        fullscreen: false,
        exitOnClose: true,
        layout: "vertical",
        apiName: "Ti.UI.Window",
        id: "index",
        classes: []
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createLabel({
        color: "#a00",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        shadowColor: "#999",
        shadowOffset: {
            x: 3,
            y: 3
        },
        text: "some text",
        apiName: "Ti.UI.Label",
        id: "label",
        classes: [ "main", "shadow" ]
    });
    $.__views.index.add($.__views.label);
    $.__views.__alloyId0 = Alloy.createController("labels", {
        apiName: "Alloy.Require",
        id: "__alloyId0",
        classes: [],
        __parentSymbol: $.__views.index
    });
    $.__views.__alloyId0.setParent($.__views.index);
    $.__views.__alloyId1 = Alloy.createController("buttons", {
        apiName: "Alloy.Require",
        id: "__alloyId1",
        classes: [],
        __parentSymbol: $.__views.index
    });
    $.__views.__alloyId1.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    try {
        require("specs/index")($);
    } catch (e) {
        Ti.API.warn("no unit tests found for index.js");
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;