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
        fullscreen: false,
        exitOnClose: true,
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        top: "30dp",
        color: "#222",
        font: {
            fontSize: "12dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        left: 20,
        text: L("hello_world"),
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.widget_lang = Alloy.createWidget("com.language.widget", "widget", {
        id: "widget_lang",
        __parentSymbol: $.__views.index
    });
    $.__views.widget_lang.setParent($.__views.index);
    $.__views.widget_random = Alloy.createWidget("com.random.widget", "widget", {
        id: "widget_random",
        __parentSymbol: $.__views.index
    });
    $.__views.widget_random.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;