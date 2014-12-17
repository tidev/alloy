function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doOnOpen() {
        Ti.API.info("doOnOpen");
    }
    function doOnFocus() {
        Ti.API.info("doOnFocus");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
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
    $.__views.ScheduleGroup = Ti.UI.createTabGroup({
        id: "ScheduleGroup",
        activeTabIconTint: "yellow",
        tabsBackgroundSelectedColor: "yellow"
    });
    $.__views.__alloyId1 = Ti.UI.createWindow({
        title: "tab 1",
        backgroundColor: "#fff",
        id: "__alloyId1"
    });
    $.__views.__alloyId0 = Ti.UI.createTab({
        window: $.__views.__alloyId1,
        title: "tab 1",
        id: "__alloyId0"
    });
    $.__views.ScheduleGroup.addTab($.__views.__alloyId0);
    $.__views.__alloyId3 = Ti.UI.createWindow({
        title: "tab 2",
        backgroundColor: "#fff",
        id: "__alloyId3"
    });
    $.__views.__alloyId2 = Ti.UI.createTab({
        window: $.__views.__alloyId3,
        title: "tab 2",
        id: "__alloyId2"
    });
    $.__views.ScheduleGroup.addTab($.__views.__alloyId2);
    $.__views.ScheduleGroup && $.addTopLevelView($.__views.ScheduleGroup);
    doOnOpen ? $.__views.ScheduleGroup.addEventListener("open", doOnOpen) : __defers["$.__views.ScheduleGroup!open!doOnOpen"] = true;
    doOnFocus ? $.__views.ScheduleGroup.addEventListener("focus", doOnFocus) : __defers["$.__views.ScheduleGroup!focus!doOnFocus"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.ScheduleGroup.open();
    __defers["$.__views.ScheduleGroup!open!doOnOpen"] && $.__views.ScheduleGroup.addEventListener("open", doOnOpen);
    __defers["$.__views.ScheduleGroup!focus!doOnFocus"] && $.__views.ScheduleGroup.addEventListener("focus", doOnFocus);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;