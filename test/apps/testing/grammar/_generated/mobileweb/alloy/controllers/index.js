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
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createLabel({
        backgroundColor: "black",
        text: L(Alloy.CFG.someText, Alloy.CFG.someText),
        height: Ti.UI.SIZE,
        font: {
            fontSize: 24,
            fontWeight: "bold"
        },
        width: Ti.UI.SIZE,
        color: "red",
        top: 10,
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        id: "label"
    });
    $.__views.index.add($.__views.label);
    $.__views.__alloyId0 = Alloy.createWidget("com.test.hellobutton", "widget", {
        id: "__alloyId0",
        __parentSymbol: $.__views.index
    });
    $.__views.__alloyId0.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;