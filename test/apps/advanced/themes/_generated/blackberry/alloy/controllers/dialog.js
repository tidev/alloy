function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function handleAnimation() {
        anim.removeEventListener("complete", handleAnimation);
        $.button.title = "You made it!";
    }
    function closeDialog() {
        anim.removeEventListener("complete", handleAnimation);
        $.progressFront.animate();
        $.dialog.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "dialog";
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
    $.__views.dialog = Ti.UI.createWindow({
        backgroundColor: "transparent",
        id: "dialog"
    });
    $.__views.dialog && $.addTopLevelView($.__views.dialog);
    $.__views.cover = Ti.UI.createView({
        backgroundColor: "#000",
        opacity: .65,
        id: "cover"
    });
    $.__views.dialog.add($.__views.cover);
    $.__views.mainView = Ti.UI.createView({
        height: 155,
        width: "85%",
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: "#fff",
        backgroundImage: "/bg_gray.png",
        borderColor: "#1e99fd",
        id: "mainView",
        layout: "vertical"
    });
    $.__views.dialog.add($.__views.mainView);
    $.__views.patienceLabel = Ti.UI.createLabel({
        color: "#fff",
        top: 10,
        text: "Testing your patience...",
        id: "patienceLabel"
    });
    $.__views.mainView.add($.__views.patienceLabel);
    $.__views.progressBack = Ti.UI.createView({
        width: 200,
        height: 30,
        top: 15,
        backgroundColor: "#333",
        id: "progressBack"
    });
    $.__views.mainView.add($.__views.progressBack);
    $.__views.progressFront = Ti.UI.createView({
        width: 50,
        left: 1,
        top: 1,
        height: 28,
        backgroundColor: "#00f",
        backgroundImage: "/title_blue.png",
        id: "progressFront"
    });
    $.__views.progressBack.add($.__views.progressFront);
    $.__views.button = Ti.UI.createButton({
        color: "#fff",
        backgroundImage: "/button_blue.png",
        top: 15,
        height: 50,
        width: 120,
        title: "I quit!",
        id: "button"
    });
    $.__views.mainView.add($.__views.button);
    closeDialog ? $.__views.button.addEventListener("click", closeDialog) : __defers["$.__views.button!click!closeDialog"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var anim;
    exports.show = function(duration) {
        $.button.title = "I quit!";
        $.progressFront.width = 20;
        $.dialog.open();
        anim = Ti.UI.createAnimation({
            duration: duration,
            width: 198,
            height: 28
        });
        anim.addEventListener("complete", handleAnimation);
        $.progressFront.animate(anim);
        require("specs/dialog")($);
    };
    __defers["$.__views.button!click!closeDialog"] && $.__views.button.addEventListener("click", closeDialog);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;