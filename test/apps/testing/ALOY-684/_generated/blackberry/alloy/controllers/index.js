function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function addNewLabel() {
        var index = ctr % classes.length;
        var label = Alloy.UI.create("index", "Label", {
            classes: classes[index],
            id: "newLabel" + (ctr + 1),
            text: "this is label #" + (ctr + 1),
            touchEnabled: false
        });
        $.index.add(label);
        ctr++;
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
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    addNewLabel ? $.__views.index.addEventListener("click", addNewLabel) : __defers["$.__views.index!click!addNewLabel"] = true;
    $.__views.staticLabel = Ti.UI.createLabel({
        color: "#a00",
        font: {
            fontSize: "32dp",
            fontWeight: "bold"
        },
        textAlign: "center",
        top: "15dp",
        shadowColor: "#aaa",
        shadowOffset: {
            x: 2,
            y: 2
        },
        text: "static text",
        id: "staticLabel"
    });
    $.__views.index.add($.__views.staticLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var ctr = 0;
    var classes = [ [], [ "big" ], [ "blue" ], "shadow", [ "shadow" ], [ "shadow", "big" ], [ "big", "shadow" ], [ "big", "blue", "shadow" ], "big blue shadow" ];
    $.index.open();
    __defers["$.__views.index!click!addNewLabel"] && $.__views.index.addEventListener("click", addNewLabel);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;