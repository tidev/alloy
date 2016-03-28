function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function btnClick(e) {
        alert(e.source.title + " is clicked");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId3 = [];
    $.__views.__alloyId4 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.CANCEL,
        title: "Cancel",
        id: "__alloyId4"
    });
    __alloyId3.push($.__views.__alloyId4);
    btnClick ? $.addListener($.__views.__alloyId4, "click", btnClick) : __defers["$.__views.__alloyId4!click!btnClick"] = true;
    $.__views.__alloyId5 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    __alloyId3.push($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.CAMERA,
        title: "Camera",
        id: "__alloyId6"
    });
    __alloyId3.push($.__views.__alloyId6);
    btnClick ? $.addListener($.__views.__alloyId6, "click", btnClick) : __defers["$.__views.__alloyId6!click!btnClick"] = true;
    $.__views.__alloyId7 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    __alloyId3.push($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createButton({
        title: "Send",
        style: Ti.UI.iPhone.SystemButtonStyle.DONE,
        id: "__alloyId8"
    });
    __alloyId3.push($.__views.__alloyId8);
    btnClick ? $.addListener($.__views.__alloyId8, "click", btnClick) : __defers["$.__views.__alloyId8!click!btnClick"] = true;
    $.__views.__alloyId1 = Ti.UI.iOS.createToolbar({
        items: __alloyId3,
        id: "__alloyId1"
    });
    $.__views.textArea = Ti.UI.createTextArea({
        keyboardToolbarColor: "#999",
        keyboardToolbarHeight: "40",
        height: "30dp",
        width: "80%",
        top: 30,
        borderWidth: "1",
        borderRadius: "3",
        borderColor: "#bbb",
        font: {
            fontSize: 12
        },
        value: "Focus to see keyboard with toolbar",
        keyboardToolbar: $.__views.__alloyId1,
        id: "textArea"
    });
    $.__views.index.add($.__views.textArea);
    $.__views.__alloyId1 = Ti.UI.iOS.createToolbar({
        keyboardToolbar: $.__views.__alloyId1,
        id: "textArea"
    });
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.__alloyId4!click!btnClick"] && $.addListener($.__views.__alloyId4, "click", btnClick);
    __defers["$.__views.__alloyId6!click!btnClick"] && $.addListener($.__views.__alloyId6, "click", btnClick);
    __defers["$.__views.__alloyId8!click!btnClick"] && $.addListener($.__views.__alloyId8, "click", btnClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;