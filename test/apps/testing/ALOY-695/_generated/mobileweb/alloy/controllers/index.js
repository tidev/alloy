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
        var index = ctr % Alloy.Globals.classes.length;
        var label = $.UI.create("Label", {
            classes: Alloy.Globals.classes[index],
            id: "newLabel" + (ctr + 1),
            text: "this is label #" + (ctr + 1),
            touchEnabled: false
        });
        $.index.add(label);
        ctr++;
    }
    function openFooBar() {
        Alloy.createController("foo/bar").getView().open();
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
        text: "click me to open another window",
        id: "staticLabel"
    });
    $.__views.index.add($.__views.staticLabel);
    openFooBar ? $.__views.staticLabel.addEventListener("click", openFooBar) : __defers["$.__views.staticLabel!click!openFooBar"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var ctr = 0;
    $.index.open();
    __defers["$.__views.index!click!addNewLabel"] && $.__views.index.addEventListener("click", addNewLabel);
    __defers["$.__views.staticLabel!click!openFooBar"] && $.__views.staticLabel.addEventListener("click", openFooBar);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;