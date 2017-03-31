function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId7() {
        $.__views.ScheduleGroup.removeEventListener("open", __alloyId7);
        if ($.__views.ScheduleGroup.activity) $.__views.ScheduleGroup.activity.onCreateOptionsMenu = function(e) {
            var __alloyId5 = {
                id: "refreshMenuItem",
                title: "Refresh",
                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM,
                itemId: 1
            };
            $.__views.refreshMenuItem = e.menu.add(_.pick(__alloyId5, Alloy.Android.menuItemCreateArgs));
            $.__views.refreshMenuItem.applyProperties(_.omit(__alloyId5, Alloy.Android.menuItemCreateArgs));
            $.refreshMenuItem = $.__views.refreshMenuItem;
            doRefresh ? $.addListener($.__views.refreshMenuItem, "click", doRefresh) : __defers["$.__views.refreshMenuItem!click!doRefresh"] = true;
            var __alloyId6 = {
                id: "settingsMenuItem",
                title: "Settings",
                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM,
                itemId: 0
            };
            $.__views.settingsMenuItem = e.menu.add(_.pick(__alloyId6, Alloy.Android.menuItemCreateArgs));
            $.__views.settingsMenuItem.applyProperties(_.omit(__alloyId6, Alloy.Android.menuItemCreateArgs));
            $.settingsMenuItem = $.__views.settingsMenuItem;
            doSettingsMenuItem ? $.addListener($.__views.settingsMenuItem, "click", doSettingsMenuItem) : __defers["$.__views.settingsMenuItem!click!doSettingsMenuItem"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function doOnOpen() {
        Ti.API.info("doOnOpen");
    }
    function doOnFocus() {
        Ti.API.info("doOnFocus");
    }
    function doSettingsMenuItem() {
        Ti.API.info("doSettingsMenuItem");
    }
    function doRefresh() {
        Ti.API.info("doRefresh");
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
        title: "tab 1",
        backgroundColor: "#fff",
        id: "__alloyId2"
    });
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "tab 1",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId4 = Ti.UI.createWindow({
        title: "tab 2",
        backgroundColor: "#fff",
        id: "__alloyId4"
    });
    $.__views.__alloyId3 = Ti.UI.createTab({
        window: $.__views.__alloyId4,
        title: "tab 2",
        id: "__alloyId3"
    });
    __alloyId0.push($.__views.__alloyId3);
    $.__views.ScheduleGroup = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "ScheduleGroup",
        activeTabIconTint: "yellow",
        tabsBackgroundSelectedColor: "yellow"
    });
    $.__views.ScheduleGroup.addEventListener("open", __alloyId7);
    $.__views.ScheduleGroup && $.addTopLevelView($.__views.ScheduleGroup);
    doOnOpen ? $.addListener($.__views.ScheduleGroup, "open", doOnOpen) : __defers["$.__views.ScheduleGroup!open!doOnOpen"] = true;
    doOnFocus ? $.addListener($.__views.ScheduleGroup, "focus", doOnFocus) : __defers["$.__views.ScheduleGroup!focus!doOnFocus"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.ScheduleGroup.open();
    __defers["$.__views.refreshMenuItem!click!doRefresh"] && $.addListener($.__views.refreshMenuItem, "click", doRefresh);
    __defers["$.__views.settingsMenuItem!click!doSettingsMenuItem"] && $.addListener($.__views.settingsMenuItem, "click", doSettingsMenuItem);
    __defers["$.__views.ScheduleGroup!open!doOnOpen"] && $.addListener($.__views.ScheduleGroup, "open", doOnOpen);
    __defers["$.__views.ScheduleGroup!focus!doOnFocus"] && $.addListener($.__views.ScheduleGroup, "focus", doOnFocus);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;