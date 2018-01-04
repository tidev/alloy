function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doClick() {
        alert("The sum of 1+2 is " + util.sum(1, 2));
    }
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
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        text: "Click to add some numbers",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    doClick ? $.addListener($.__views.__alloyId0, "click", doClick) : __defers["$.__views.__alloyId0!click!doClick"] = true;
    $.__views.__alloyId1 = Ti.UI.createImageView({
        image: "/appcelerator.png",
        bottom: 0,
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var util = require("util");
    $.index.open();
    __defers["$.__views.__alloyId0!click!doClick"] && $.addListener($.__views.__alloyId0, "click", doClick);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;