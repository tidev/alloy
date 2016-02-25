function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "baseDialog";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.cover = Ti.UI.createView({
        backgroundColor: "#000",
        opacity: .5,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "cover"
    });
    $.__views.cover && $.addTopLevelView($.__views.cover);
    $.__views.dialog = Ti.UI.createView({
        height: "100dp",
        width: "66%",
        backgroundColor: "#fff",
        borderColor: "#000",
        borderWidth: 2,
        borderRadius: 4,
        id: "dialog"
    });
    $.__views.dialog && $.addTopLevelView($.__views.dialog);
    $.__views.message = Ti.UI.createLabel({
        color: "#000",
        left: 10,
        right: 10,
        top: 10,
        height: Ti.UI.SIZE,
        font: {
            fontSize: "16dp"
        },
        textAlign: "center",
        text: "You opened the dialog!",
        id: "message"
    });
    $.__views.dialog.add($.__views.message);
    $.__views.closeButton = Ti.UI.createButton({
        bottom: 10,
        title: "Close Dialog",
        id: "closeButton"
    });
    $.__views.dialog.add($.__views.closeButton);
    try {
        $.__views.closeButton.addEventListener("click", exports.closeDialog);
    } catch (e) {
        __defers["$.__views.closeButton!click!exports.closeDialog"] = true;
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.message.text = args.message || "dialog";
    exports.openDialog = function(win) {
        $.refWin = win;
        $.refWin.add($.cover);
        $.refWin.add($.dialog);
    };
    exports.closeDialog = function() {
        $.refWin.remove($.cover);
        $.refWin.remove($.dialog);
        $.refWin = $.cover = $.dialog = null;
    };
    require("specs/baseDialog")($, {
        message: $.message.text
    });
    __defers["$.__views.closeButton!click!exports.closeDialog"] && $.__views.closeButton.addEventListener("click", exports.closeDialog);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;