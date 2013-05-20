function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.middle = Ti.UI.createView({
        backgroundColor: "red",
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        id: "middle"
    });
    $.__views.middle && $.addTopLevelView($.__views.middle);
    $.__views.t = Ti.UI.createLabel({
        color: "yellow",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        text: "Middle",
        id: "t"
    });
    $.__views.middle.add($.__views.t);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("specs/middle")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;