function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId15() {
        $.__views.index.removeEventListener("open", __alloyId15);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            var __alloyId12 = {
                title: "help",
                icon: "/ic_menu_help.png",
                id: "__alloyId11"
            };
            $.__views.__alloyId11 = e.menu.add(_.pick(__alloyId12, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId11.applyProperties(_.omit(__alloyId12, Alloy.Android.menuItemCreateArgs));
            $.__alloyId11 = $.__views.__alloyId11;
            doClick ? $.__views.__alloyId11.addEventListener("click", doClick) : __defers["$.__views.__alloyId11!click!doClick"] = true;
            var __alloyId14 = {
                title: "home",
                icon: "/ic_menu_home.png",
                id: "__alloyId13"
            };
            $.__views.__alloyId13 = e.menu.add(_.pick(__alloyId14, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId13.applyProperties(_.omit(__alloyId14, Alloy.Android.menuItemCreateArgs));
            $.__alloyId13 = $.__views.__alloyId13;
            doClick ? $.__views.__alloyId13.addEventListener("click", doClick) : __defers["$.__views.__alloyId13!click!doClick"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function doClick(e) {
        alert("tab " + currentTab + ": " + e.source.title);
    }
    function setCurrentTab(e) {
        currentTab = e.index + 1;
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
    var __alloyId0 = [];
    $.__views.__alloyId2 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        title: "window 1",
        id: "__alloyId2"
    });
    $.__views.__alloyId3 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#111",
        textAlign: "center",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        text: "Label 1",
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "tab 1",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId5 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        title: "window 2",
        id: "__alloyId5"
    });
    $.__views.__alloyId6 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#111",
        textAlign: "center",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        text: "Label 2",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.__alloyId4 = Ti.UI.createTab({
        window: $.__views.__alloyId5,
        title: "tab 2",
        id: "__alloyId4"
    });
    __alloyId0.push($.__views.__alloyId4);
    $.__views.__alloyId8 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        title: "window 3",
        id: "__alloyId8"
    });
    $.__views.__alloyId9 = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#111",
        textAlign: "center",
        font: {
            fontSize: "48dp",
            fontWeight: "bold"
        },
        text: "Label 3",
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.__alloyId7 = Ti.UI.createTab({
        window: $.__views.__alloyId8,
        title: "tab 3",
        id: "__alloyId7"
    });
    __alloyId0.push($.__views.__alloyId7);
    $.__views.index = Ti.UI.createTabGroup({
        backgroundColor: "#fff",
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index.addEventListener("open", __alloyId15);
    $.__views.index && $.addTopLevelView($.__views.index);
    setCurrentTab ? $.__views.index.addEventListener("focus", setCurrentTab) : __defers["$.__views.index!focus!setCurrentTab"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var currentTab;
    $.index.open();
    __defers["$.__views.__alloyId11!click!doClick"] && $.__views.__alloyId11.addEventListener("click", doClick);
    __defers["$.__views.__alloyId13!click!doClick"] && $.__views.__alloyId13.addEventListener("click", doClick);
    __defers["$.__views.index!focus!setCurrentTab"] && $.__views.index.addEventListener("focus", setCurrentTab);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;