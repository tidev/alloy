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
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.opt = Alloy.createWidget("optionDialog", "widget", {
        id: "opt",
        __parentSymbol: $.__views.index
    });
    $.__views.opt.setParent($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "As long as you don't see a red screen of death, this is working as expected",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("alloy/animation").popIn(Ti.UI.createView({
        width: 300,
        height: 300,
        backgroundColor: "red"
    }), function(e) {});
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;