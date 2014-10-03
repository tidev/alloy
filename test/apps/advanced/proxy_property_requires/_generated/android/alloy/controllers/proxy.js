function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "proxy";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
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
    $.__views.headerView && $.addProxyProperty("headerView", $.__views.headerView);
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
    $.__views.footerView && $.addProxyProperty("footerView", $.__views.footerView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("specs/proxy")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;