function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "alloy.testWidget/" + s : s.substring(0, index) + "/alloy.testWidget/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    new (require("alloy/widget"))("alloy.testWidget");
    this.__widgetId = "alloy.testWidget";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "labelmaker";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.createLabels = function() {
        var container = $.UI.create("View", {
            classes: "container"
        });
        container.add(Ti.UI.createLabel(Alloy.createStyle({
            widgetId: "alloy.testWidget",
            name: "labelmaker"
        }, {
            apiName: "Ti.UI.Label",
            text: "Alloy.createStyle() + Ti.UI.createLabel()"
        })));
        container.add(Ti.UI.createLabel($.createStyle({
            apiName: "Ti.UI.Label",
            text: "$.createStyle() + Ti.UI.createLabel()"
        })));
        container.add(Alloy.UI.create({
            widgetId: "alloy.testWidget",
            name: "labelmaker"
        }, "Ti.UI.Label", {
            text: "Alloy.UI.create()"
        }));
        container.add($.UI.create("Ti.UI.Label", {
            text: "$.UI.create()"
        }));
        return container;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;