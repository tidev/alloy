function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doClose() {
        $.navWin.close();
    }
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
    var __defers = {};
    $.__views.__alloyId0 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        layout: "vertical",
        title: "Child window",
        id: "__alloyId0"
    });
    $.__views.close = Ti.UI.createButton({
        id: "close",
        title: "Close"
    });
    doClose ? $.__views.close.addEventListener("click", doClose) : __defers["$.__views.close!click!doClose"] = true;
    $.__views.__alloyId0.leftNavButton = $.__views.close;
    $.__views.argLabel = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
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
        $.args.someProperty && _.extend(o, {
            text: "args.someProperty is truthy"
        });
        _.extend(o, {
            id: "argLabel"
        });
        return o;
    }());
    $.__views.__alloyId0.add($.__views.argLabel);
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
        $.__views.__alloyId0.add($.__views.argLabelTwo);
    }
    $.__views.navWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId0,
        id: "navWin"
    });
    $.__views.navWin && $.addTopLevelView($.__views.navWin);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    __defers["$.__views.close!click!doClose"] && $.__views.close.addEventListener("click", doClose);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;