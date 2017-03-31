function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.language.widget/" + s : s.substring(0, index) + "/com.language.widget/" + s.substring(index + 1);
    return 0 !== path.indexOf("/") ? "/" + path : path;
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
    new (require("/alloy/widget"))("com.language.widget");
    this.__widgetId = "com.language.widget";
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
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
        top: "30dp",
        color: "#000",
        font: {
            fontSize: 13,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "This is com.language.widget",
        id: "header"
    });
    $.__views.header && $.addTopLevelView($.__views.header);
    $.__views.myLabel = Ti.UI.createLabel({
        top: "5dp",
        color: "#000",
        font: {
            fontSize: 13,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: L("language__intro_text"),
        id: "myLabel"
    });
    $.__views.myLabel && $.addTopLevelView($.__views.myLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;