function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "proxy";
    var __parentSymbol = arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.headerView = Ti.UI.createView({
        id: "headerView",
        height: "60dp",
        backgroundColor: "#0f0"
    });
    $.__views.headerText = Ti.UI.createLabel({
        text: "I'm an ugly headerView",
        id: "headerText"
    });
    $.__views.headerView.add($.__views.headerText);
    __parentSymbol.headerView = $.__views.headerView;
    $.__views.__alloyId35 && $.addTopLevelView($.__views.__alloyId35);
    $.__views.footerView = Ti.UI.createView({
        id: "footerView",
        height: "60dp",
        backgroundColor: "#0f0"
    });
    $.__views.footerText = Ti.UI.createLabel({
        text: "I'm an equally ugly footerView",
        id: "footerText"
    });
    $.__views.footerView.add($.__views.footerText);
    __parentSymbol.footerView = $.__views.footerView;
    $.__views.__alloyId36 && $.addTopLevelView($.__views.__alloyId36);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("specs/proxy")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;