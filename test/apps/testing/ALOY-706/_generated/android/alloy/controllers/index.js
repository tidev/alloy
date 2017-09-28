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
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#eee",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
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
        id: "label"
    });
    $.__views.index.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    $.newLabel = $.UI.create("Ti.UI.Label", {
        id: "newLabel",
        classes: "main",
        bottom: 0,
        text: "$.UI.create() Label",
        textAlign: "center"
    });
    $.index.add($.newLabel);
    try {
        require("specs/index")($);
    } catch (e) {
        Ti.API.warn("no unit tests found for index.js");
    }
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;