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
    this.__controllerPath = "labels";
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
    $.__views.labels = Ti.UI.createView({
        apiName: "Ti.UI.View",
        backgroundColor: "#fcc",
        height: Ti.UI.SIZE,
        layout: "vertical",
        id: "labels",
        classes: []
    });
    $.__views.labels && $.addTopLevelView($.__views.labels);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        color: "#000",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        top: 15,
        backgroundColor: "#ccf",
        text: "label 1",
        apiName: "Ti.UI.Label",
        classes: [ "someClass" ],
        id: "__alloyId2"
    });
    $.__views.labels.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        color: "#000",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        top: 15,
        backgroundColor: "#ccf",
        text: "label 2",
        apiName: "Ti.UI.Label",
        classes: [ "someClass" ],
        id: "__alloyId3"
    });
    $.__views.labels.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        color: "#000",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        top: 15,
        backgroundColor: "#ccf",
        text: "label 3",
        apiName: "Ti.UI.Label",
        classes: [ "someClass" ],
        id: "__alloyId4"
    });
    $.__views.labels.add($.__views.__alloyId4);
    exports.destroy = function() {};
    _.extend($, $.__views);
    try {
        require("specs/labels")($);
    } catch (e) {
        Ti.API.warn("no unit tests found for labels.js");
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;