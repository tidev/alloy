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
    this.__controllerPath = "childview";
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
    $.__views.childview = Ti.UI.createView({
        layout: "vertical",
        id: "childview"
    });
    $.__views.childview && $.addTopLevelView($.__views.childview);
    $.__views.label = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: "200dp",
        color: "white",
        font: {
            fontWeight: "bold"
        },
        id: "label"
    });
    $.__views.childview.add($.__views.label);
    $.__views.anotherlabel = Ti.UI.createLabel({
        id: "anotherlabel"
    });
    $.__views.childview.add($.__views.anotherlabel);
    $.__views.aRequiredView = Alloy.createController("aRequiredLabel", {
        id: "aRequiredView",
        __parentSymbol: $.__views.childview
    });
    $.__views.aRequiredView.setParent($.__views.childview);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;