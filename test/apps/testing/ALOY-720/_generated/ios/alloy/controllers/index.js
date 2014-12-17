function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doSave() {
        alert("save");
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
    $.__views.__alloyId0 = Ti.UI.createWindow({
        title: "NavigationWindow",
        id: "__alloyId0"
    });
    $.__views.__alloyId2 = Alloy.createWidget("alloy.button", "widget", {
        title: "ios",
        id: "__alloyId2"
    });
    doSave ? $.__views.__alloyId2.on("click", doSave) : __defers["$.__views.__alloyId2!click!doSave"] = true;
    $.__views.__alloyId0.rightNavButton = $.__views.__alloyId2.getViewEx({
        recurse: true
    });
    $.__views.info = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#000",
        textAlign: "center",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        id: "info"
    });
    $.__views.__alloyId0.add($.__views.info);
    $.__views.index = Ti.UI.iOS.createNavigationWindow({
        backgroundColor: "#fff",
        modal: false,
        exitOnClose: true,
        window: $.__views.__alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.info.text = 'Click the rightNavButton to "save"';
    $.index.open();
    __defers["$.__views.__alloyId2!click!doSave"] && $.__views.__alloyId2.on("click", doSave);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;