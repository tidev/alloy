function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function showAlert(e) {
        alert("Alloy.CFG.someValue = " + Alloy.CFG.someValue);
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
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.b = Ti.UI.createButton({
        width: "50%",
        height: Ti.UI.SIZE,
        randomProp: "OK",
        title: "click me",
        id: "b"
    });
    $.__views.index.add($.__views.b);
    showAlert ? $.addListener($.__views.b, "click", showAlert) : __defers["$.__views.b!click!showAlert"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.b!click!showAlert"] && $.addListener($.__views.b, "click", showAlert);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;