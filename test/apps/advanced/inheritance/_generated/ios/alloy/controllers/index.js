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
        Alloy.createController(e.source.title, {
            message: "Opened " + e.source.title
        }).openDialog($.index);
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
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createView({
        layout: "vertical",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createButton({
        title: "baseDialog",
        id: "__alloyId1"
    });
    $.__views.__alloyId0.add($.__views.__alloyId1);
    openDialog ? $.__views.__alloyId1.addEventListener("click", openDialog) : __defers["$.__views.__alloyId1!click!openDialog"] = true;
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "animatedDialog",
        id: "__alloyId2"
    });
    $.__views.__alloyId0.add($.__views.__alloyId2);
    openDialog ? $.__views.__alloyId2.addEventListener("click", openDialog) : __defers["$.__views.__alloyId2!click!openDialog"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.__alloyId1!click!openDialog"] && $.__views.__alloyId1.addEventListener("click", openDialog);
    __defers["$.__views.__alloyId2!click!openDialog"] && $.__views.__alloyId2.addEventListener("click", openDialog);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;