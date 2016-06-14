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
    this.__controllerPath = "childWindow";
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
    $.__views.childWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        layout: "vertical",
        id: "childWindow"
    });
    $.__views.childWindow && $.addTopLevelView($.__views.childWindow);
    $.__views.argLabel = Ti.UI.createLabel(function() {
        var o = {};
        Alloy.deepExtend(true, o, {
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            color: "#000",
            textAlign: "center",
            font: {
                fontSize: "24dp",
                fontWeight: "bold"
            },
            text: "args.someProperty is falsey",
            top: 25
        });
        $.args.someProperty && Alloy.deepExtend(true, o, {
            text: "args.someProperty is truthy"
        });
        Alloy.deepExtend(true, o, {
            id: "argLabel"
        });
        return o;
    }());
    $.__views.childWindow.add($.__views.argLabel);
    if ($.args.someProperty) {
        $.__views.argLabelTwo = Ti.UI.createLabel({
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            color: "#000",
            textAlign: "center",
            font: {
                fontSize: "24dp",
                fontWeight: "bold"
            },
            text: "XML-based if condition",
            top: 25,
            id: "argLabelTwo"
        });
        $.__views.childWindow.add($.__views.argLabelTwo);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;