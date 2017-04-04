function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId11() {
        $.__views.index.removeEventListener("open", __alloyId11);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            $.__views.__alloyId3 = Ti.UI.createTextField({
                hintText: "Use a SearchView",
                id: "__alloyId3"
            });
            $.__alloyId3 = $.__views.__alloyId3;
            var __alloyId4 = {
                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW,
                icon: Ti.Android.R.drawable.ic_menu_search,
                id: "__alloyId1"
            };
            $.__views.__alloyId3 && (__alloyId4.actionView = $.__views.__alloyId3);
            $.__views.__alloyId1 = e.menu.add(_.pick(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId1.applyProperties(_.omit(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.__alloyId1 = $.__views.__alloyId1;
            $.__views.__alloyId7 = Ti.UI.createButton({
                title: "Click",
                id: "__alloyId7"
            });
            $.__alloyId7 = $.__views.__alloyId7;
            var __alloyId8 = {
                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM,
                id: "__alloyId5"
            };
            $.__views.__alloyId7 && (__alloyId8.actionView = $.__views.__alloyId7);
            $.__views.__alloyId5 = e.menu.add(_.pick(__alloyId8, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId5.applyProperties(_.omit(__alloyId8, Alloy.Android.menuItemCreateArgs));
            $.__alloyId5 = $.__views.__alloyId5;
            var __alloyId10 = {
                title: "Normal",
                id: "__alloyId9"
            };
            $.__views.__alloyId9 = e.menu.add(_.pick(__alloyId10, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId9.applyProperties(_.omit(__alloyId10, Alloy.Android.menuItemCreateArgs));
            $.__alloyId9 = $.__views.__alloyId9;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.index.addEventListener("open", __alloyId11);
    $.__views.__alloyId12 = Ti.UI.createLabel({
        color: "black",
        font: {
            fontSize: "14dp"
        },
        text: "Tap search icon to expand ActionView",
        id: "__alloyId12"
    });
    $.__views.index.add($.__views.__alloyId12);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;