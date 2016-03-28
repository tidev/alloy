function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.random.widget/" + s : s.substring(0, index) + "/com.random.widget/" + s.substring(index + 1);
    return path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    new (require("alloy/widget"))("com.random.widget");
    this.__widgetId = "com.random.widget";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.header = Ti.UI.createLabel({
        top: "20dp",
        color: "gray",
        font: {
            fontSize: "12dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        right: 20,
        text: "This is com.random.widget",
        id: "header"
    });
    $.__views.header && $.addTopLevelView($.__views.header);
    $.__views.widget = Ti.UI.createLabel({
        top: "5dp",
        color: "gray",
        font: {
            fontSize: "12dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        right: 20,
        text: L("random__welcome"),
        id: "widget"
    });
    $.__views.widget && $.addTopLevelView($.__views.widget);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;