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
    var __alloyId3 = {
        properties: {
            name: "TabbedItem"
        },
        childTemplates: __alloyId4
    };
    __alloyId1["TabbedItem"] = __alloyId3;
    var __alloyId9 = [];
    $.__views.__alloyId10 = {
        template: "TabbedItem",
        tabs: {
            index: 0
        },
        properties: {
            id: "__alloyId10"
        }
    };
    __alloyId9.push($.__views.__alloyId10);
    $.__views.__alloyId11 = {
        template: "TabbedItem",
        tabs: {
            index: 1
        },
        properties: {
            id: "__alloyId11"
        }
    };
    __alloyId9.push($.__views.__alloyId11);
    $.__views.__alloyId7 = Ti.UI.createListSection({
        id: "__alloyId7"
    });
    $.__views.__alloyId7.items = __alloyId9;
    var __alloyId12 = [];
    __alloyId12.push($.__views.__alloyId7);
    $.__views.__alloyId0 = Ti.UI.createListView({
        sections: __alloyId12,
        templates: __alloyId1,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;