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
    $.__views.childWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        layout: "vertical",
        id: "childWindow"
    });
    $.__views.childWindow && $.addTopLevelView($.__views.childWindow);
    $.__views.navWin = Ti.UI.createWindow({
        backgroundColor: "#fff",
        layout: "vertical",
        title: "Child window",
        id: "navWin"
    });
    $.__views.close = Ti.UI.createButton({
        id: "close",
        title: "Close"
    });
    doClose ? $.__views.close.addEventListener("click", doClose) : __defers["$.__views.close!click!doClose"] = true;
    $.__views.navWin.leftNavButton = $.__views.close;
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
    $.__views.navWin.add($.__views.argLabel);
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
        $.__views.navWin.add($.__views.argLabelTwo);
    }
    $.__views.__alloyId0 = Ti.UI.MobileWeb.createNavigationGroup({
        window: $.__views.navWin,
        id: "__alloyId0"
    });
    $.__views.childWindow.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    __defers["$.__views.close!click!doClose"] && $.__views.close.addEventListener("click", doClose);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;