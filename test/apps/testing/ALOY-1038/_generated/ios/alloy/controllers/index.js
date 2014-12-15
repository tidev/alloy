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
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.explain = Ti.UI.createLabel({
        color: "blue",
        font: {
            fontSize: "10dp",
            fontStyle: "italic"
        },
        top: 20,
        text: "You should see 6 labels above and 6 below the line",
        id: "explain"
    });
    $.__views.index.add($.__views.explain);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        text: "ios",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "ios,mobileweb",
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        text: "ios,android",
        id: "__alloyId2"
    });
    $.__views.index.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        text: "!android",
        id: "__alloyId3"
    });
    $.__views.index.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        text: "!mobileweb",
        id: "__alloyId4"
    });
    $.__views.index.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createLabel({
        text: "mobileweb,!android",
        id: "__alloyId5"
    });
    $.__views.index.add($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createView({
        height: "1",
        width: Ti.UI.FILL,
        backgroundColor: "black",
        top: "10",
        id: "__alloyId6"
    });
    $.__views.index.add($.__views.__alloyId6);
    $.__views.ios = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        text: "TSS: ios",
        id: "ios"
    });
    $.__views.index.add($.__views.ios);
    $.__views.android = Ti.UI.createLabel({
        height: 0,
        id: "android"
    });
    $.__views.index.add($.__views.android);
    $.__views.mobileweb = Ti.UI.createLabel({
        height: 0,
        id: "mobileweb"
    });
    $.__views.index.add($.__views.mobileweb);
    $.__views.iosmobileweb = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        text: "TSS: ios,mobilweb",
        id: "iosmobileweb"
    });
    $.__views.index.add($.__views.iosmobileweb);
    $.__views.androidmobileweb = Ti.UI.createLabel({
        height: 0,
        id: "androidmobileweb"
    });
    $.__views.index.add($.__views.androidmobileweb);
    $.__views.iosandroid = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        text: "TSS: ios,android",
        id: "iosandroid"
    });
    $.__views.index.add($.__views.iosandroid);
    $.__views.notios = Ti.UI.createLabel({
        height: 0,
        id: "notios"
    });
    $.__views.index.add($.__views.notios);
    $.__views.notandroid = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        text: "TSS: !android",
        id: "notandroid"
    });
    $.__views.index.add($.__views.notandroid);
    $.__views.notmobileweb = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        text: "TSS: !mobileweb",
        id: "notmobileweb"
    });
    $.__views.index.add($.__views.notmobileweb);
    $.__views.mobilewebNotios = Ti.UI.createLabel({
        height: 0,
        id: "mobilewebNotios"
    });
    $.__views.index.add($.__views.mobilewebNotios);
    $.__views.mobilewebNotandroid = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        text: "TSS: mobileweb,!android",
        id: "mobilewebNotandroid"
    });
    $.__views.index.add($.__views.mobilewebNotandroid);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;