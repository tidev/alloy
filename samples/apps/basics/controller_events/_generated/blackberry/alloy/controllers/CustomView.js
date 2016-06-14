function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function fireEvent() {
        $.trigger("someEvent", {
            message: $.text.value
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "CustomView";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.CustomView = Ti.UI.createView({
        layout: "vertical",
        height: "300",
        backgroundColor: "blue",
        id: "CustomView"
    });
    $.__views.CustomView && $.addTopLevelView($.__views.CustomView);
    $.__views.text = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        id: "text",
        top: "10",
        height: "44",
        width: "250"
    });
    $.__views.CustomView.add($.__views.text);
    $.__views.btn = Ti.UI.createButton({
        title: "Fire Event",
        id: "btn",
        top: "10",
        height: "44",
        width: "250"
    });
    $.__views.CustomView.add($.__views.btn);
    fireEvent ? $.__views.btn.addEventListener("click", fireEvent) : __defers["$.__views.btn!click!fireEvent"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("specs/CustomView")($);
    __defers["$.__views.btn!click!fireEvent"] && $.__views.btn.addEventListener("click", fireEvent);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;