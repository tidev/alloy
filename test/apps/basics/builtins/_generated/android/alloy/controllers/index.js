function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function shake() {
        animation.shake($.mover, 0, function() {
            alert("Shake ended.");
        });
    }
    function flash() {
        animation.flash($.mover);
    }
    function trim() {
        $.label.text = string.trim($.label.text);
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
        backgroundColor: "#fff",
        modal: false,
        exitOnClose: true,
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.mover = Ti.UI.createView({
        backgroundColor: "#a00",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        top: "20dp",
        id: "mover"
    });
    $.__views.index.add($.__views.mover);
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
    $.__views.index.add($.__views.shake);
    shake ? $.__views.shake.addEventListener("click", shake) : __defers["$.__views.shake!click!shake"] = true;
    $.__views.flash = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "20dp",
        title: "Flash",
        id: "flash"
    });
    $.__views.index.add($.__views.flash);
    flash ? $.__views.flash.addEventListener("click", flash) : __defers["$.__views.flash!click!flash"] = true;
    $.__views.trim = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "20dp",
        title: "Trim",
        id: "trim"
    });
    $.__views.index.add($.__views.trim);
    trim ? $.__views.trim.addEventListener("click", trim) : __defers["$.__views.trim!click!trim"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var animation = require("alloy/animation"), string = require("alloy/string");
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.shake!click!shake"] && $.__views.shake.addEventListener("click", shake);
    __defers["$.__views.flash!click!flash"] && $.__views.flash.addEventListener("click", flash);
    __defers["$.__views.trim!click!trim"] && $.__views.trim.addEventListener("click", trim);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;