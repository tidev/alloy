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
    $.__views.__alloyId0 = Ti.UI.createView({
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    var __alloyId3 = [];
    $.__views.__alloyId4 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.ACTION,
        id: "__alloyId4"
    });
    __alloyId3.push($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    __alloyId3.push($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.TRASH,
        id: "__alloyId6"
    });
    __alloyId3.push($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    __alloyId3.push($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.ADD,
        id: "__alloyId8"
    });
    __alloyId3.push($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    __alloyId3.push($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.CAMERA,
        id: "__alloyId10"
    });
    __alloyId3.push($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    __alloyId3.push($.__views.__alloyId11);
    $.__views.__alloyId12 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.CANCEL,
        id: "__alloyId12"
    });
    __alloyId3.push($.__views.__alloyId12);
    $.__views.__alloyId1 = Ti.UI.iOS.createToolbar({
        items: __alloyId3,
        id: "__alloyId1"
    });
    $.__views.__alloyId0.add($.__views.__alloyId1);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;