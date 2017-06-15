function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId1 = {};
    var __alloyId4 = [];
    var __alloyId6 = {
        type: "Ti.UI.Label",
        properties: {
            bindid: "title"
        }
    };
    __alloyId4.push(__alloyId6);
    var __alloyId9 = [];
    var __alloyId12 = {
        title: "Label 1"
    };
    __alloyId9.push(__alloyId12);
    var __alloyId13 = {
        title: "Label 2"
    };
    __alloyId9.push(__alloyId13);
    var __alloyId14 = {
        type: "Ti.UI.iOS.TabbedBar",
        bindId: "tabs",
        properties: {
            labels: __alloyId9,
            bindId: "tabs"
        }
    };
    __alloyId4.push(__alloyId14);
    var __alloyId3 = {
        properties: {
            name: "TabbedItem"
        },
        childTemplates: __alloyId4
    };
    __alloyId1["TabbedItem"] = __alloyId3;
    var __alloyId17 = [];
    $.__views.__alloyId18 = {
        template: "TabbedItem",
        tabs: {
            index: 0
        },
        properties: {
            id: "__alloyId18"
        }
    };
    __alloyId17.push($.__views.__alloyId18);
    $.__views.__alloyId19 = {
        template: "TabbedItem",
        tabs: {
            index: 1
        },
        properties: {
            id: "__alloyId19"
        }
    };
    __alloyId17.push($.__views.__alloyId19);
    $.__views.__alloyId15 = Ti.UI.createListSection({
        id: "__alloyId15"
    });
    $.__views.__alloyId15.items = __alloyId17;
    var __alloyId20 = [];
    __alloyId20.push($.__views.__alloyId15);
    $.__views.__alloyId0 = Ti.UI.createListView({
        sections: __alloyId20,
        templates: __alloyId1,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;