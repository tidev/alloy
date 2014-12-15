function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function showOptions() {
        $.dialog.show();
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
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId1 = [];
    __alloyId1.push("Confirm");
    __alloyId1.push("Cancel");
    var __alloyId6 = [];
    __alloyId6.push("Help");
    $.__views.__alloyId8 = Ti.UI.createView({
        id: "__alloyId8"
    });
    $.__views.__alloyId9 = Ti.UI.createLabel({
        font: {
            fontSize: "14dp"
        },
        text: "In an AndroidView",
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.dialog = Ti.UI.createOptionDialog({
        options: __alloyId1,
        buttonNames: __alloyId6,
        androidView: $.__views.__alloyId8,
        id: "dialog",
        title: "Delete File?"
    });
    $.__views.__alloyId10 = Ti.UI.createLabel({
        font: {
            fontSize: "14dp"
        },
        text: "Click for OptionDialog",
        id: "__alloyId10"
    });
    $.__views.index.add($.__views.__alloyId10);
    showOptions ? $.__views.__alloyId10.addEventListener("click", showOptions) : __defers["$.__views.__alloyId10!click!showOptions"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.__alloyId10!click!showOptions"] && $.__views.__alloyId10.addEventListener("click", showOptions);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;