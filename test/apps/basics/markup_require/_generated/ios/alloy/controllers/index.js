function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__path = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.top = Ti.UI.createView({
        backgroundColor: "black",
        borderRadius: 2,
        borderColor: "blue",
        height: 100,
        id: "top"
    });
    $.__views.index.add($.__views.top);
    $.__views.__alloyId1 = Alloy.createController("theRest", {
        id: "__alloyId1",
        __parentSymbol: $.__views.index
    });
    $.__views.__alloyId1.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;