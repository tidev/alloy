function Controller() {
    function openDialog(e) {
        alert("Mobileweb version not full implemented.\nSee TIMOB-13816 for details.");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId1 = Ti.UI.createView({
        layout: "vertical",
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "baseDialog",
        id: "__alloyId2"
    });
    $.__views.__alloyId1.add($.__views.__alloyId2);
    openDialog ? $.__views.__alloyId2.addEventListener("click", openDialog) : __defers["$.__views.__alloyId2!click!openDialog"] = true;
    $.__views.__alloyId3 = Ti.UI.createButton({
        title: "animatedDialog",
        id: "__alloyId3"
    });
    $.__views.__alloyId1.add($.__views.__alloyId3);
    openDialog ? $.__views.__alloyId3.addEventListener("click", openDialog) : __defers["$.__views.__alloyId3!click!openDialog"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.__alloyId2!click!openDialog"] && $.__views.__alloyId2.addEventListener("click", openDialog);
    __defers["$.__views.__alloyId3!click!openDialog"] && $.__views.__alloyId3.addEventListener("click", openDialog);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;