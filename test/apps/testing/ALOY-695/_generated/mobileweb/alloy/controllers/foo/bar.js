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
        $.bar.add(label);
        ctr++;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "foo/bar";
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
    $.__views.bar = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        layout: "vertical",
        id: "bar"
    });
    $.__views.bar && $.addTopLevelView($.__views.bar);
    addNewLabel ? $.__views.bar.addEventListener("click", addNewLabel) : __defers["$.__views.bar!click!addNewLabel"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var ctr = 0;
    __defers["$.__views.bar!click!addNewLabel"] && $.__views.bar.addEventListener("click", addNewLabel);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;