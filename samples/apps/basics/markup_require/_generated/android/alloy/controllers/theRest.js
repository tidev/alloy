function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "theRest";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.middle = Alloy.createController("middle", {
        id: "middle",
        __parentSymbol: __parentSymbol
    });
    $.__views.middle && $.addTopLevelView($.__views.middle);
    $.__views.bottom = Alloy.createController("bottom", {
        id: "bottom",
        __parentSymbol: __parentSymbol
    });
    $.__views.bottom && $.addTopLevelView($.__views.bottom);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.bottom.getView("b").addEventListener("click", function() {
        $.middle.getView("t").text = "You clicked me";
    });
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;