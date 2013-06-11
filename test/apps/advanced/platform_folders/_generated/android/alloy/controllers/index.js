function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#000",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.scroll = Ti.UI.createScrollView({
        id: "scroll",
        layout: "vertical"
    });
    $.__views.index.add($.__views.scroll);
    $.__views.__alloyId1 = Ti.UI.createImageView({
        image: "/appc1.png",
        id: "__alloyId1"
    });
    $.__views.scroll.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createImageView({
        image: "/appc2.png",
        id: "__alloyId2"
    });
    $.__views.scroll.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createImageView({
        image: "/appc3.png",
        id: "__alloyId3"
    });
    $.__views.scroll.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createImageView({
        image: "/appc4.png",
        id: "__alloyId4"
    });
    $.__views.scroll.add($.__views.__alloyId4);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;