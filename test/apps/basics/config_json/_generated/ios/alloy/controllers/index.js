function Controller() {
    function showAlert() {
        alert("Alloy.CFG.someValue = " + Alloy.CFG.someValue);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__path = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
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
    showAlert ? $.__views.b.addEventListener("click", showAlert) : __defers["$.__views.b!click!showAlert"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    __defers["$.__views.b!click!showAlert"] && $.__views.b.addEventListener("click", showAlert);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;