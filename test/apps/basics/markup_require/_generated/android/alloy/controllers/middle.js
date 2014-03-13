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
    this.__controllerPath = "middle";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.middle = Ti.UI.createView({
        backgroundColor: "red",
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        id: "middle"
    });
    $.__views.middle && $.addTopLevelView($.__views.middle);
    $.__views.t = Ti.UI.createLabel({
        color: "yellow",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Middle",
        id: "t"
    });
    $.__views.middle.add($.__views.t);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("specs/middle")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;