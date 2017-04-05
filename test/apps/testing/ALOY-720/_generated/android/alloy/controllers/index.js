function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId3() {
        $.__views.index.removeEventListener("open", __alloyId3);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            $.__views.__alloyId2 = Alloy.createWidget("alloy.button", "widget", {
                title: "android",
                id: "__alloyId2",
                __parentSymbol: e.menu
            });
            doSave ? $.__views.__alloyId2.on("click", doSave) : __defers["$.__views.__alloyId2!click!doSave"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function doSave(e) {
        alert("save");
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.index.addEventListener("open", __alloyId3);
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
    $.__views.index.add($.__views.info);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.info.text = 'Click the menu button to "save"';
    $.index.open();
    __defers["$.__views.__alloyId2!click!doSave"] && $.__views.__alloyId2.on("click", doSave);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;