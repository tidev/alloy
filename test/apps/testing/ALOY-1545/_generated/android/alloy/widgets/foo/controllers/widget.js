function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "foo/" + s : s.substring(0, index) + "/foo/" + s.substring(index + 1);
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
    function onClick(e) {
        $.trigger("customevent", {
            sender: $,
            data: e
        });
    }
    new (require("alloy/widget"))("foo");
    this.__widgetId = "foo";
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
    var __defers = {};
    $.__views.widget = Ti.UI.createLabel({
        text: "Click Me!",
        id: "widget"
    });
    $.__views.widget && $.addTopLevelView($.__views.widget);
    onClick ? $.addListener($.__views.widget, "click", onClick) : __defers["$.__views.widget!click!onClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.widget!click!onClick"] && $.addListener($.__views.widget, "click", onClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;