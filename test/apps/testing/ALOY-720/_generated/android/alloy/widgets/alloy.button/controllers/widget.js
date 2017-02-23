function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "alloy.button/" + s : s.substring(0, index) + "/alloy.button/" + s.substring(index + 1);
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
    function doClick(e) {
        $.trigger("click", e);
    }
    new (require("alloy/widget"))("alloy.button");
    this.__widgetId = "alloy.button";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    var __alloyId0 = {
        id: "button"
    };
    $.__views.button = __parentSymbol.add(_.pick(__alloyId0, Alloy.Android.menuItemCreateArgs));
    $.__views.button.applyProperties(_.omit(__alloyId0, Alloy.Android.menuItemCreateArgs));
    $.button = $.__views.button;
    $.__views.button && $.addTopLevelView($.__views.button);
    doClick ? $.addListener($.__views.button, "click", doClick) : __defers["$.__views.button!click!doClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.button.title = args.title || "click me";
    __defers["$.__views.button!click!doClick"] && $.addListener($.__views.button, "click", doClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;