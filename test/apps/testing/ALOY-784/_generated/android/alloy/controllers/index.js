function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId2() {
        $.__views.index.removeEventListener("open", __alloyId2);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            var __alloyId0 = {
                showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
                title: "One",
                id: "item1"
            };
            $.__views.item1 = e.menu.add(_.pick(__alloyId0, Alloy.Android.menuItemCreateArgs));
            $.__views.item1.applyProperties(_.omit(__alloyId0, Alloy.Android.menuItemCreateArgs));
            $.item1 = $.__views.item1;
            doMenuClick ? $.__views.item1.addEventListener("click", doMenuClick) : __defers["$.__views.item1!click!doMenuClick"] = true;
            var __alloyId1 = {
                showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
                title: "Two",
                icon: Ti.Android.R.drawable.ic_menu_share,
                id: "item2"
            };
            $.__views.item2 = e.menu.add(_.pick(__alloyId1, Alloy.Android.menuItemCreateArgs));
            $.__views.item2.applyProperties(_.omit(__alloyId1, Alloy.Android.menuItemCreateArgs));
            $.item2 = $.__views.item2;
            doMenuClick ? $.__views.item2.addEventListener("click", doMenuClick) : __defers["$.__views.item2!click!doMenuClick"] = true;
            if ($.__views.index.activity.actionBar) {
                $.__views.index.activity.actionBar.title = "My XML Menu";
                $.__views.index.activity.actionBar.backgroundImage = "/actionbackground.png";
                $.__views.index.activity.actionBar.displayHomeAsUp = true;
                $.__views.index.activity.actionBar.icon = "/actionicon.png";
                $.__views.index.activity.actionBar.onHomeIconItemSelected = doMenuClick;
            }
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function doClick() {
        alert("label clicked");
    }
    function doMenuClick() {
        alert("menu clicked");
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
    $.__views.index = Ti.UI.createWindow({
        title: "My Test App",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.index.addEventListener("open", __alloyId2);
    $.__views.label = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        text: "Hello, World",
        id: "label"
    });
    $.__views.index.add($.__views.label);
    doClick ? $.__views.label.addEventListener("click", doClick) : __defers["$.__views.label!click!doClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.item1!click!doMenuClick"] && $.__views.item1.addEventListener("click", doMenuClick);
    __defers["$.__views.item2!click!doMenuClick"] && $.__views.item2.addEventListener("click", doMenuClick);
    __defers["$.__views.label!click!doClick"] && $.__views.label.addEventListener("click", doClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;