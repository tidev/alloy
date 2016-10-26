function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doLeftClick() {
        alert("Left button clicked");
    }
    function doRightClick() {
        alert("Right button clicked");
    }
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
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
        title: "Proxy Shorthands",
        id: "__alloyId0"
    });
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Left",
        id: "__alloyId2"
    });
    doLeftClick ? $.addListener($.__views.__alloyId2, "click", doLeftClick) : __defers["$.__views.__alloyId2!click!doLeftClick"] = true;
    $.__views.__alloyId0.leftNavButton = $.__views.__alloyId2;
    $.__views.__alloyId3 = Ti.UI.createButton({
        title: "Right",
        id: "__alloyId3"
    });
    $.__views.__alloyId0.rightNavButton = $.__views.__alloyId3;
    doRightClick ? $.addListener($.__views.__alloyId3, "click", doRightClick) : __defers["$.__views.__alloyId3!click!doRightClick"] = true;
    $.__views.index = Ti.UI.iOS.createNavigationWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        window: $.__views.__alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.__alloyId2!click!doLeftClick"] && $.addListener($.__views.__alloyId2, "click", doLeftClick);
    __defers["$.__views.__alloyId3!click!doRightClick"] && $.addListener($.__views.__alloyId3, "click", doRightClick);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;