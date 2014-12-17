function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId14() {
        __parentSymbol.removeEventListener("open", __alloyId14);
        if (__parentSymbol.activity) __parentSymbol.activity.onCreateOptionsMenu = function(e) {
            var __alloyId11 = {
                title: "require 1",
                icon: "/ic_menu_goto.png",
                id: "__alloyId10"
            };
            $.__views.__alloyId10 = e.menu.add(_.pick(__alloyId11, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId10.applyProperties(_.omit(__alloyId11, Alloy.Android.menuItemCreateArgs));
            $.__alloyId10 = $.__views.__alloyId10;
            doClick ? $.__views.__alloyId10.addEventListener("click", doClick) : __defers["$.__views.__alloyId10!click!doClick"] = true;
            var __alloyId13 = {
                title: "require 2",
                icon: "/ic_menu_manage.png",
                id: "__alloyId12"
            };
            $.__views.__alloyId12 = e.menu.add(_.pick(__alloyId13, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId12.applyProperties(_.omit(__alloyId13, Alloy.Android.menuItemCreateArgs));
            $.__alloyId12 = $.__views.__alloyId12;
            doClick ? $.__views.__alloyId12.addEventListener("click", doClick) : __defers["$.__views.__alloyId12!click!doClick"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function doClick(e) {
        alert(e.source.title);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "menu";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
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
    __parentSymbol.addEventListener("open", __alloyId14);
    $.__views.menu && $.addTopLevelView($.__views.menu);
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.__alloyId10!click!doClick"] && $.__views.__alloyId10.addEventListener("click", doClick);
    __defers["$.__views.__alloyId12!click!doClick"] && $.__views.__alloyId12.addEventListener("click", doClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;