function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function openDialog(e) {
        alert("Mobileweb version not full implemented.\nSee TIMOB-13816 for details.");
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
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.container = Ti.UI.createView({
        top: "40dp",
        id: "container",
        layout: "vertical"
    });
    $.__views.index.add($.__views.container);
    $.__views.__alloyId0 = Ti.UI.createButton({
        title: "baseDialog",
        id: "__alloyId0"
    });
    $.__views.container.add($.__views.__alloyId0);
    openDialog ? $.addListener($.__views.__alloyId0, "click", openDialog) : __defers["$.__views.__alloyId0!click!openDialog"] = true;
    $.__views.__alloyId1 = Ti.UI.createButton({
        title: "animatedDialog",
        id: "__alloyId1"
    });
    $.__views.container.add($.__views.__alloyId1);
    openDialog ? $.addListener($.__views.__alloyId1, "click", openDialog) : __defers["$.__views.__alloyId1!click!openDialog"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.__alloyId0!click!openDialog"] && $.addListener($.__views.__alloyId0, "click", openDialog);
    __defers["$.__views.__alloyId1!click!openDialog"] && $.addListener($.__views.__alloyId1, "click", openDialog);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;