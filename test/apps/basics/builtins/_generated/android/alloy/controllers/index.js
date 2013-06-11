function Controller() {
    function ShakeClick() {
        animation.shake($.mover, 0, function() {
            alert("Shake ended.");
        });
    }
    function FlashClick() {
        animation.flash($.mover);
    }
    function TrimClick() {
        $.label.text = string.trim($.label.text);
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
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.backdrop = Ti.UI.createView({
        backgroundColor: "#fff",
        id: "backdrop"
    });
    $.__views.index.add($.__views.backdrop);
    $.__views.__alloyId1 = Ti.UI.createView({
        layout: "vertical",
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    $.__views.mover = Ti.UI.createView({
        backgroundColor: "#a00",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        top: "20dp",
        id: "mover"
    });
    $.__views.__alloyId1.add($.__views.mover);
    $.__views.label = Ti.UI.createLabel({
        color: "#eee",
        font: {
            fontSize: "28dp",
            fontWeight: "bold"
        },
        text: "Trimmable String",
        id: "label"
    });
    $.__views.mover.add($.__views.label);
    $.__views.shake = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "20dp",
        title: "Shake",
        id: "shake"
    });
    $.__views.__alloyId1.add($.__views.shake);
    ShakeClick ? $.__views.shake.addEventListener("click", ShakeClick) : __defers["$.__views.shake!click!ShakeClick"] = true;
    $.__views.flash = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "20dp",
        title: "Flash",
        id: "flash"
    });
    $.__views.__alloyId1.add($.__views.flash);
    FlashClick ? $.__views.flash.addEventListener("click", FlashClick) : __defers["$.__views.flash!click!FlashClick"] = true;
    $.__views.trim = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        top: "20dp",
        title: "Trim",
        id: "trim"
    });
    $.__views.__alloyId1.add($.__views.trim);
    TrimClick ? $.__views.trim.addEventListener("click", TrimClick) : __defers["$.__views.trim!click!TrimClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var animation = require("alloy/animation"), string = require("alloy/string");
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.shake!click!ShakeClick"] && $.__views.shake.addEventListener("click", ShakeClick);
    __defers["$.__views.flash!click!FlashClick"] && $.__views.flash.addEventListener("click", FlashClick);
    __defers["$.__views.trim!click!TrimClick"] && $.__views.trim.addEventListener("click", TrimClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;