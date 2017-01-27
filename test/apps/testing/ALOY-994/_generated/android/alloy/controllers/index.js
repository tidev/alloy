function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId1() {
        $.__views.index.removeEventListener("open", __alloyId1);
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
    function __alloyId7() {
        $.__views.index.removeEventListener("open", __alloyId7);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            var __alloyId4 = {
                title: "option 1",
                icon: "/ic_menu_help.png",
                id: "__alloyId3"
            };
            $.__views.__alloyId3 = e.menu.add(_.pick(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId3.applyProperties(_.omit(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.__alloyId3 = $.__views.__alloyId3;
            doClick ? $.addListener($.__views.__alloyId3, "click", doClick) : __defers["$.__views.__alloyId3!click!doClick"] = true;
            var __alloyId6 = {
                title: "option 2",
                icon: "/ic_menu_home.png",
                id: "__alloyId5"
            };
            $.__views.__alloyId5 = e.menu.add(_.pick(__alloyId6, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId5.applyProperties(_.omit(__alloyId6, Alloy.Android.menuItemCreateArgs));
            $.__alloyId5 = $.__views.__alloyId5;
            openWin2 ? $.addListener($.__views.__alloyId5, "click", openWin2) : __defers["$.__views.__alloyId5!click!openWin2"] = true;
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
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#000",
        modal: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.index.addEventListener("open", __alloyId1);
    $.__views.index.addEventListener("open", __alloyId7);
    $.__views.__alloyId8 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Window 1",
        id: "__alloyId8"
    });
    $.__views.index.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Press the menu button",
        bottom: "20dp",
        id: "__alloyId9"
    });
    $.__views.index.add($.__views.__alloyId9);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.__alloyId3!click!doClick"] && $.addListener($.__views.__alloyId3, "click", doClick);
    __defers["$.__views.__alloyId5!click!openWin2"] && $.addListener($.__views.__alloyId5, "click", openWin2);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;