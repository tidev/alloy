function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function buttonClick(e) {
        e.cancelBubble = true;
        Ti.API.info("button clicked");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "empty";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.empty = Ti.UI.createButton({
        title: "useless button",
        bottom: 50,
        id: "empty"
    });
    $.__views.empty && $.addTopLevelView($.__views.empty);
    buttonClick ? $.addListener($.__views.empty, "click", buttonClick) : __defers["$.__views.empty!click!buttonClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.empty.fireEvent("click");
    setTimeout(function() {
        $.trigger("init");
    }, 2e3);
    __defers["$.__views.empty!click!buttonClick"] && $.addListener($.__views.empty, "click", buttonClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;