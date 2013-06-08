function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__path = "bottom";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.bottom = Ti.UI.createView({
        id: "bottom"
    });
    $.__views.bottom && $.addTopLevelView($.__views.bottom);
    $.__views.b = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        title: "Click me",
        bottom: 20,
        id: "b"
    });
    $.__views.bottom.add($.__views.b);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.API.info("bottom controller is executing");
    require("specs/bottom")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;