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
    function __alloyId22() {
        $.__views.win2.removeEventListener("open", __alloyId22);
        if ($.__views.win2.activity) $.__views.win2.activity.onCreateOptionsMenu = function(e) {
            var __alloyId19 = {
                title: "require 1",
                icon: "/ic_menu_goto.png",
                id: "__alloyId18"
            };
            $.__views.__alloyId18 = e.menu.add(_.pick(__alloyId19, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId18.applyProperties(_.omit(__alloyId19, Alloy.Android.menuItemCreateArgs));
            $.__alloyId18 = $.__views.__alloyId18;
            doClick ? $.__views.__alloyId18.addEventListener("click", doClick) : __defers["$.__views.__alloyId18!click!doClick"] = true;
            var __alloyId21 = {
                title: "require 2",
                icon: "/ic_menu_manage.png",
                id: "__alloyId20"
            };
            $.__views.__alloyId20 = e.menu.add(_.pick(__alloyId21, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId20.applyProperties(_.omit(__alloyId21, Alloy.Android.menuItemCreateArgs));
            $.__alloyId20 = $.__views.__alloyId20;
            doClick ? $.__views.__alloyId20.addEventListener("click", doClick) : __defers["$.__views.__alloyId20!click!doClick"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function doHomeIcon() {
        $.win2.close();
    }
    function doClick(e) {
        alert(e.source.title);
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
    var __defers = {};
    $.__views.win2 = Ti.UI.createWindow({
        backgroundColor: "#000",
        id: "win2"
    });
    $.__views.win2 && $.addTopLevelView($.__views.win2);
    $.__views.win2.addEventListener("open", __alloyId16);
    $.__views.win2.addEventListener("open", __alloyId22);
    $.__views.__alloyId23 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Window 2",
        id: "__alloyId23"
    });
    $.__views.win2.add($.__views.__alloyId23);
    $.__views.__alloyId24 = Ti.UI.createLabel({
        color: "#fff",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Press the menu button",
        bottom: "20dp",
        id: "__alloyId24"
    });
    $.__views.win2.add($.__views.__alloyId24);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.win2.addEventListener("open", function() {
        $.win2.activity && ($.win2.activity.actionBar.title = "Child window");
    });
    __defers["$.__views.__alloyId18!click!doClick"] && $.__views.__alloyId18.addEventListener("click", doClick);
    __defers["$.__views.__alloyId20!click!doClick"] && $.__views.__alloyId20.addEventListener("click", doClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;