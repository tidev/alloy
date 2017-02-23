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
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.appVersion = Ti.UI.createLabel({
        id: "appVersion",
        textAlign: "centerAlign",
        text: Ti.App.getVersion() + "test",
        height: Ti.UI.SIZE,
        top: 50
    });
    $.__views.index.add($.__views.appVersion);
    $.__views.appVersion = Ti.UI.createLabel({
        id: "appVersion",
        textAlign: "centerAlign",
        text: "test" + Ti.App.getVersion(),
        height: Ti.UI.SIZE,
        top: 100
    });
    $.__views.index.add($.__views.appVersion);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;