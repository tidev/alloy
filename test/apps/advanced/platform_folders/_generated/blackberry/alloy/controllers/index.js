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
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#000",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.scroll = Ti.UI.createScrollView({
        id: "scroll",
        layout: "vertical"
    });
    $.__views.index.add($.__views.scroll);
    $.__views.__alloyId0 = Ti.UI.createImageView({
        image: "/appc1.png",
        id: "__alloyId0"
    });
    $.__views.scroll.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createImageView({
        image: "/appc2.png",
        id: "__alloyId1"
    });
    $.__views.scroll.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createImageView({
        image: "/appc3.png",
        id: "__alloyId2"
    });
    $.__views.scroll.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createImageView({
        image: "/appc4.png",
        id: "__alloyId3"
    });
    $.__views.scroll.add($.__views.__alloyId3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;