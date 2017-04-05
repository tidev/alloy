function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "'Hello foo & bar\"",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createButton({
        title: "'Hello foo & bar\"",
        bottom: 50,
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    var __alloyId3 = [];
    __alloyId3.push("option &1");
    __alloyId3.push("option 2");
    __alloyId3.push("cancel &");
    __alloyId3.push("destructive");
    $.__views.options = Ti.UI.createOptionDialog({
        options: __alloyId3,
        id: "options",
        title: "App Options",
        destructive: 3,
        cancel: 2
    });
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    $.options.show();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;