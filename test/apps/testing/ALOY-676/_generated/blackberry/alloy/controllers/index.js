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
        backgroundColor: "#eee",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createScrollView({
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.constantsLabel = Ti.UI.createLabel({
        color: "#222",
        font: {
            fontSize: "14dp",
            fontWeight: "normal"
        },
        top: "15dp",
        height: Ti.UI.SIZE,
        width: "90%",
        id: "constantsLabel"
    });
    $.__views.__alloyId0.add($.__views.constantsLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var constants = require("alloy/constants");
    $.constantsLabel.text = JSON.stringify(constants.IMPLICIT_NAMESPACES, null, "	");
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;