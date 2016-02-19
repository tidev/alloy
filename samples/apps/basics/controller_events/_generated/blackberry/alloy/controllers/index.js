function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function handler(e) {
        alert("got this from custom event: " + e.message);
    }
    function removeListener() {
        $.requiredController.off("someEvent", handler);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        layout: "vertical",
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.requiredController = Alloy.createController("CustomView", {
        id: "requiredController",
        __parentSymbol: $.__views.index
    });
    $.__views.requiredController.setParent($.__views.index);
    $.__views.remove = Ti.UI.createButton({
        title: "Remove Listener",
        id: "remove",
        top: "10"
    });
    $.__views.index.add($.__views.remove);
    removeListener ? $.__views.remove.addEventListener("click", removeListener) : __defers["$.__views.remove!click!removeListener"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.requiredController.on("someEvent", handler);
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.remove!click!removeListener"] && $.__views.remove.addEventListener("click", removeListener);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;