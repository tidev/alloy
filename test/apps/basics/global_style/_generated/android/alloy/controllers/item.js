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
    this.__controllerPath = "item";
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
    $.__views.item = Ti.UI.createView({
        backgroundColor: "#00f",
        id: "item"
    });
    $.__views.item && $.addTopLevelView($.__views.item);
    $.__views.label = Ti.UI.createLabel({
        color: "#f00",
        font: {
            fontSize: 24,
            fontWeight: "bold"
        },
        textAlign: "center",
        text: "should be bold, red text on blue background",
        id: "label"
    });
    $.__views.item.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("specs/item")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;