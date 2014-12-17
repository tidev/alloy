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
        title: "ALOY-991",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.bottomview = Ti.UI.createView({
        bottom: 10,
        height: 200,
        backgroundColor: "orange",
        id: "bottomview"
    });
    $.__views.index.add($.__views.bottomview);
    $.__views.viewlabel = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontSize: "20dp"
        },
        text: "Not an Android!",
        id: "viewlabel"
    });
    $.__views.bottomview.add($.__views.viewlabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;