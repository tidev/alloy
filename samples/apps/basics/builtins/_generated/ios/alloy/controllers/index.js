function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function shake(e) {
        animation.shake($.mover, 0, function() {
            alert("Shake ended.");
        });
    }
    function flash(e) {
        animation.flash($.mover);
    }
    function trim(e) {
        $.label.text = string.trim($.label.text);
    }
    function flip(e) {
        var front, back;
        e.bubbleParent = false;
        if (e.source === $.back) {
            front = $.back;
            back = $.front;
        } else {
            front = $.front;
            back = $.back;
        }
        animation.flipHorizontal(front, back, 500, function(e) {
            Ti.API.info("flipped");
        });
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
    shake ? $.addListener($.__views.shake, "click", shake) : __defers["$.__views.shake!click!shake"] = true;
    $.__views.flash = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "20dp",
        title: "Flash",
        id: "flash"
    });
    $.__views.index.add($.__views.flash);
    flash ? $.addListener($.__views.flash, "click", flash) : __defers["$.__views.flash!click!flash"] = true;
    $.__views.trim = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "20dp",
        title: "Trim",
        id: "trim"
    });
    $.__views.index.add($.__views.trim);
    trim ? $.addListener($.__views.trim, "click", trim) : __defers["$.__views.trim!click!trim"] = true;
    $.__views.__alloyId0 = Ti.UI.createView({
        height: 150,
        width: 150,
        top: 40,
        borderWidth: 1,
        borderColor: "#00f",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.back = Ti.UI.createLabel({
        text: "back",
        color: "#ccc",
        backgroundColor: "#000",
        textAlign: "center",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "back"
    });
    $.__views.__alloyId0.add($.__views.back);
    flip ? $.addListener($.__views.back, "click", flip) : __defers["$.__views.back!click!flip"] = true;
    $.__views.front = Ti.UI.createLabel({
        text: "front",
        color: "#000",
        backgroundColor: "#ccc",
        textAlign: "center",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "front"
    });
    $.__views.__alloyId0.add($.__views.front);
    flip ? $.addListener($.__views.front, "click", flip) : __defers["$.__views.front!click!flip"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var animation = require("alloy/animation"), string = require("alloy/string");
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.shake!click!shake"] && $.addListener($.__views.shake, "click", shake);
    __defers["$.__views.flash!click!flash"] && $.addListener($.__views.flash, "click", flash);
    __defers["$.__views.trim!click!trim"] && $.addListener($.__views.trim, "click", trim);
    __defers["$.__views.back!click!flip"] && $.addListener($.__views.back, "click", flip);
    __defers["$.__views.front!click!flip"] && $.addListener($.__views.front, "click", flip);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;