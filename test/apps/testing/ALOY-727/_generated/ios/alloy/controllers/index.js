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
        $.options.show();
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
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId1 = [];
    __alloyId1.push("button 1");
    __alloyId1.push("button 2");
    $.__views.options = Ti.UI.createOptionDialog({
        buttonNames: __alloyId1,
        id: "options",
        title: "App Options",
        destructive: 3,
        cancel: 2
    });
    $.__views.__alloyId4 = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        title: "options",
        id: "__alloyId4"
    });
    $.__views.index.add($.__views.__alloyId4);
    showOptions ? $.addListener($.__views.__alloyId4, "click", showOptions) : __defers["$.__views.__alloyId4!click!showOptions"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.avLabel.text = "This is an androidView";
    $.index.open();
    __defers["$.__views.__alloyId4!click!showOptions"] && $.addListener($.__views.__alloyId4, "click", showOptions);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;