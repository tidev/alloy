function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId16() {
        $.__views.win2.removeEventListener("open", __alloyId16);
        if ($.__views.win2.activity) {
            $.__views.win2.activity.actionBar.backgroundImage = "/actionbackground.png";
            $.__views.win2.activity.actionBar.displayHomeAsUp = true;
            $.__views.win2.activity.actionBar.icon = "/actionicon.png";
            $.__views.win2.activity.actionBar.onHomeIconItemSelected = doHomeIcon;
        } else {
            Ti.API.warn("You attempted to access an Activity on a lightweight Window or other");
            Ti.API.warn("UI component which does not have an Android activity. Android Activities");
            Ti.API.warn("are valid with only windows in TabGroups or heavyweight Windows.");
        }
    }
    function doHomeIcon() {
        $.win2.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win2";
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
    $.__views.win2 = Ti.UI.createWindow({
        backgroundColor: "#000",
        modal: false,
        id: "win2"
    });
    $.__views.win2 && $.addTopLevelView($.__views.win2);
    $.__views.win2.addEventListener("open", __alloyId16);
    $.__views.__alloyId17 = Alloy.createController("menu", {
        id: "__alloyId17",
        __parentSymbol: $.__views.win2
    });
    $.__views.__alloyId17.setParent($.__views.win2);
    $.__views.__alloyId18 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Window 2",
        id: "__alloyId18"
    });
    $.__views.win2.add($.__views.__alloyId18);
    $.__views.__alloyId19 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Press the menu button",
        bottom: "20dp",
        id: "__alloyId19"
    });
    $.__views.win2.add($.__views.__alloyId19);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.win2.addEventListener("open", function() {
        $.win2.activity && ($.win2.activity.actionBar.title = "Child window");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;