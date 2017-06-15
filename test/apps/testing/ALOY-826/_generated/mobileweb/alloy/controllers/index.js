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
    var __alloyId4 = [];
    $.__views.__alloyId5 = {
        properties: {
            title: "One",
            id: "__alloyId5"
        }
    };
    __alloyId4.push($.__views.__alloyId5);
    $.__views.__alloyId6 = {
        properties: {
            title: "Two",
            id: "__alloyId6"
        }
    };
    __alloyId4.push($.__views.__alloyId6);
    $.__views.__alloyId7 = {
        properties: {
            title: "Three",
            id: "__alloyId7"
        }
    };
    __alloyId4.push($.__views.__alloyId7);
    $.__views.__alloyId2 = Ti.UI.createListSection({
        id: "__alloyId2"
    });
    $.__views.__alloyId2.items = __alloyId4;
    var __alloyId8 = [];
    __alloyId8.push($.__views.__alloyId2);
    $.__views.__alloyId10 = Alloy.createController("section", {
        id: "__alloyId10"
    });
    __alloyId8.push($.__views.__alloyId10.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId0 = Ti.UI.createListView({
        sections: __alloyId8,
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