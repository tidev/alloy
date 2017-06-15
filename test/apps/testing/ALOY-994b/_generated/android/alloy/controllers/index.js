function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId8() {
        $.__views.index.removeEventListener("open", __alloyId8);
        if ($.__views.index.activity) {
            $.__views.index.activity.actionBar.title = "My App Title";
            $.__views.index.activity.actionBar.subtitle = "App subtitle";
            $.__views.index.activity.actionBar.backgroundImage = "/actionbackground.png";
            $.__views.index.activity.actionBar.icon = "/actionicon.png";
        } else {
            Ti.API.warn("You attempted to access an Activity on a lightweight Window or other");
            Ti.API.warn("UI component which does not have an Android activity. Android Activities");
            Ti.API.warn("are valid with only windows in TabGroups or heavyweight Windows.");
        }
    }
    function __alloyId14() {
        $.__views.index.removeEventListener("open", __alloyId14);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            var __alloyId11 = {
                title: "Show alert",
                id: "__alloyId10"
            };
            $.__views.__alloyId10 = e.menu.add(_.pick(__alloyId11, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId10.applyProperties(_.omit(__alloyId11, Alloy.Android.menuItemCreateArgs));
            $.__alloyId10 = $.__views.__alloyId10;
            doClick ? $.addListener($.__views.__alloyId10, "click", doClick) : __defers["$.__views.__alloyId10!click!doClick"] = true;
            var __alloyId13 = {
                title: "Open Win2",
                id: "__alloyId12"
            };
            $.__views.__alloyId12 = e.menu.add(_.pick(__alloyId13, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId12.applyProperties(_.omit(__alloyId13, Alloy.Android.menuItemCreateArgs));
            $.__alloyId12 = $.__views.__alloyId12;
            openWin2 ? $.addListener($.__views.__alloyId12, "click", openWin2) : __defers["$.__views.__alloyId12!click!openWin2"] = true;
            $.__views.index.activity.actionBar && ($.__views.index.activity.actionBar.title = "Title from menu");
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function doClick(e) {
        alert(e.source.title);
    }
    function openWin2(e) {
        Alloy.createController("win2").getView().open();
    }
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    var __alloyId0 = [];
    $.__views.__alloyId2 = Ti.UI.createWindow({
        backgroundColor: "#000",
        title: "Win 1",
        id: "__alloyId2"
    });
    $.__views.__alloyId3 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "I am Window 1",
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "Tab 1",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId5 = Ti.UI.createWindow({
        backgroundColor: "#000",
        title: "Win 2",
        id: "__alloyId5"
    });
    $.__views.__alloyId6 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "I am Window 2",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.__alloyId4 = Ti.UI.createTab({
        window: $.__views.__alloyId5,
        title: "Tab 2",
        id: "__alloyId4"
    });
    __alloyId0.push($.__views.__alloyId4);
    $.__views.index = Ti.UI.createTabGroup({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index.addEventListener("open", __alloyId8);
    $.__views.index.addEventListener("open", __alloyId14);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.__alloyId10!click!doClick"] && $.addListener($.__views.__alloyId10, "click", doClick);
    __defers["$.__views.__alloyId12!click!openWin2"] && $.addListener($.__views.__alloyId12, "click", openWin2);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;