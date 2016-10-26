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
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        touchEnabled: false,
        text: "Click to show OptionDialog",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    var __alloyId2 = [];
    __alloyId2.push(L("hello_world"));
    __alloyId2.push(Ti.Locale.getString("hello_world"));
    __alloyId2.push(Titanium.Locale.getString("hello_world"));
    __alloyId2.push("Hello, World!");
    $.__views.options = Ti.UI.createOptionDialog({
        options: __alloyId2,
        id: "options"
    });
    $.__views.options && $.addTopLevelView($.__views.options);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.addEventListener("click", function() {
        $.options.show();
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;