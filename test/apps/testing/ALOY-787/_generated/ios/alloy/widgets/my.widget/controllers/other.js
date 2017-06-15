function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "my.widget/" + s : s.substring(0, index) + "/my.widget/" + s.substring(index + 1);
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
    new (require("/alloy/widget"))("my.widget");
    this.__widgetId = "my.widget";
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "other";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.other = Ti.UI.createView({
        id: "other"
    });
    $.__views.other && $.addTopLevelView($.__views.other);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        text: "my.widget loaded",
        id: "__alloyId0"
    });
    $.__views.other.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;