function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "optionDialog/" + s : s.substring(0, index) + "/optionDialog/" + s.substring(index + 1);
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
    new (require("alloy/widget"))("optionDialog");
    this.__widgetId = "optionDialog";
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
    $.__views.theView = Ti.UI.createView({
        height: 200,
        width: 200,
        backgroundColor: "#888",
        id: "theView"
    });
    $.__views.theView && $.addTopLevelView($.__views.theView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("alloy/animation").popIn($.theView, function() {});
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;