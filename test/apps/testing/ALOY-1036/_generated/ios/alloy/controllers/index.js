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
        top: 20,
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.testLabel = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            font: {
                fontSize: "22dp"
            },
            color: "purple",
            text: "Simple class label applied"
        });
        (Alloy.Globals.custom1 || Alloy.Globals.custom2) && _.extend(o, {
            text: "iOS or Android! Styles conditionals correctly applied"
        });
        _.extend(o, {
            id: "testLabel"
        });
        return o;
    }());
    $.__views.index.add($.__views.testLabel);
    if (true && (Alloy.Globals.custom1 || Alloy.Globals.custom2)) {
        $.__views.testLabel2 = Ti.UI.createLabel({
            font: {
                fontSize: "22dp"
            },
            color: "purple",
            text: "Added in XML",
            id: "testLabel2",
            bottom: "100"
        });
        $.__views.index.add($.__views.testLabel2);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;