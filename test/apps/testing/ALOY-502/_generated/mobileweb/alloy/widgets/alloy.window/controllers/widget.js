function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "alloy.window/" + s : s.substring(0, index) + "/alloy.window/" + s.substring(index + 1);
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
    new (require("/alloy/widget"))("alloy.window");
    this.__widgetId = "alloy.window";
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
    $.__views.widget = Ti.UI.createWindow({
        id: "widget"
    });
    $.__views.widget && $.addTopLevelView($.__views.widget);
    $.__views.__alloyId0 = Ti.UI.createButton({
        title: "click me",
        id: "__alloyId0"
    });
    $.__views.widget.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;