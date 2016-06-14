function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
    $.__views.__alloyId0 = Ti.UI.createWindow({
        title: "Modal",
        id: "__alloyId0"
    });
    $.__views.btnFoo = Ti.UI.createButton({
        id: "btnFoo",
        title: "Show Contacts (ios)"
    });
    $.__views.__alloyId0.add($.__views.btnFoo);
    try {
        $.addListener($.__views.btnFoo, "click", exports.showContacts);
    } catch (e) {
        __defers["$.__views.btnFoo!click!exports.showContacts"] = true;
    }
    $.__views.welcomeNav = Ti.UI.iOS.createNavigationWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        window: $.__views.__alloyId0,
        id: "welcomeNav"
    });
    $.__views.welcomeNav && $.addTopLevelView($.__views.welcomeNav);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.showContacts = function(e) {
        Ti.API.info("showContacts: " + e.source.title);
    };
    $.welcomeNav.open();
    __defers["$.__views.btnFoo!click!exports.showContacts"] && $.addListener($.__views.btnFoo, "click", exports.showContacts);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;