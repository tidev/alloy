function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId9() {
        $.__views.win.removeEventListener("open", __alloyId9);
        if ($.__views.win.activity) $.__views.win.activity.onCreateOptionsMenu = function(e) {
            var __alloyId1 = {
                id: "item1",
                title: "Expand",
                showAsAction: Titanium.Android.SHOW_AS_ACTION_IF_ROOM
            };
            $.__views.item1 = e.menu.add(_.pick(__alloyId1, Alloy.Android.menuItemCreateArgs));
            $.__views.item1.applyProperties(_.omit(__alloyId1, Alloy.Android.menuItemCreateArgs));
            $.item1 = $.__views.item1;
            expand ? $.addListener($.__views.item1, "click", expand) : __defers["$.__views.item1!click!expand"] = true;
            var __alloyId3 = {
                title: "Collapse",
                showAsAction: Titanium.Android.SHOW_AS_ACTION_IF_ROOM,
                id: "__alloyId2"
            };
            $.__views.__alloyId2 = e.menu.add(_.pick(__alloyId3, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId2.applyProperties(_.omit(__alloyId3, Alloy.Android.menuItemCreateArgs));
            $.__alloyId2 = $.__views.__alloyId2;
            collapse ? $.addListener($.__views.__alloyId2, "click", collapse) : __defers["$.__views.__alloyId2!click!collapse"] = true;
            $.__views.__alloyId5 = Ti.UI.createView({
                layout: "horizontal",
                id: "__alloyId5"
            });
            $.__views.__alloyId6 = Ti.UI.createButton({
                title: "Search",
                left: 0,
                id: "__alloyId6"
            });
            $.__views.__alloyId5.add($.__views.__alloyId6);
            $.__views.__alloyId7 = Ti.UI.createTextField({
                right: 0,
                hintText: "Type Something",
                id: "__alloyId7"
            });
            $.__views.__alloyId5.add($.__views.__alloyId7);
            $.__alloyId5 = $.__views.__alloyId5;
            var __alloyId8 = {
                id: "item3",
                title: "Item 3",
                showAsAction: Titanium.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
            };
            $.__views.__alloyId5 && (__alloyId8.actionView = $.__views.__alloyId5);
            $.__views.item3 = e.menu.add(_.pick(__alloyId8, Alloy.Android.menuItemCreateArgs));
            $.__views.item3.applyProperties(_.omit(__alloyId8, Alloy.Android.menuItemCreateArgs));
            $.item3 = $.__views.item3;
            report ? $.addListener($.__views.item3, "expand", report) : __defers["$.__views.item3!expand!report"] = true;
            report ? $.addListener($.__views.item3, "collapse", report) : __defers["$.__views.item3!collapse!report"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function expand(e) {
        $.item3.expandActionView();
    }
    function collapse(e) {
        $.item3.collapseActionView();
    }
    function report(e) {
        Ti.API.info(e.type);
        Ti.API.info($.item3.actionViewExpanded);
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
    $.__views.win = Ti.UI.createWindow({
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.win.addEventListener("open", __alloyId9);
    $.__views.msg = Ti.UI.createLabel({
        color: "white",
        text: "Tap the menu buttons",
        font: {
            fontSize: "16dp"
        },
        id: "msg"
    });
    $.__views.win.add($.__views.msg);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.win.open();
    __defers["$.__views.item1!click!expand"] && $.addListener($.__views.item1, "click", expand);
    __defers["$.__views.__alloyId2!click!collapse"] && $.addListener($.__views.__alloyId2, "click", collapse);
    __defers["$.__views.item3!expand!report"] && $.addListener($.__views.item3, "expand", report);
    __defers["$.__views.item3!collapse!report"] && $.addListener($.__views.item3, "collapse", report);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;