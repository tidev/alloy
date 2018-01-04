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
        backgroundColor: "white",
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    if (Alloy.isTablet) {
        $.__views.__alloyId2 = Ti.UI.createView({
            id: "__alloyId2"
        });
        $.__views.__alloyId3 = Ti.UI.createLabel({
            font: {
                fontSize: "20dp",
                color: "black"
            },
            text: "HeaderView Tablet",
            id: "__alloyId3"
        });
        $.__views.__alloyId2.add($.__views.__alloyId3);
    }
    if (!Alloy.isTablet) {
        $.__views.__alloyId5 = Ti.UI.createView({
            id: "__alloyId5"
        });
        $.__views.__alloyId6 = Ti.UI.createLabel({
            font: {
                fontSize: "20dp",
                color: "black"
            },
            text: "HeaderView Handheld",
            id: "__alloyId6"
        });
        $.__views.__alloyId5.add($.__views.__alloyId6);
    }
    $.__views.__alloyId0 = Ti.UI.createTableView(function() {
        var o = {};
        Alloy.isTablet && Alloy.deepExtend(true, o, {
            headerView: $.__views.__alloyId2
        });
        Alloy.isHandheld && Alloy.deepExtend(true, o, {
            headerView: $.__views.__alloyId5
        });
        Alloy.deepExtend(true, o, {
            height: "80%",
            id: "__alloyId0"
        });
        return o;
    }());
    $.__views.index.add($.__views.__alloyId0);
    if (Alloy.isTablet) {
        $.__views.__alloyId7 = Ti.UI.createView({
            id: "__alloyId7"
        });
        $.__views.index.add($.__views.__alloyId7);
        $.__views.__alloyId8 = Ti.UI.createLabel({
            font: {
                fontSize: "20dp",
                color: "black"
            },
            text: "View Tablet",
            id: "__alloyId8"
        });
        $.__views.__alloyId7.add($.__views.__alloyId8);
    }
    if (!Alloy.isTablet) {
        $.__views.__alloyId9 = Ti.UI.createView({
            id: "__alloyId9"
        });
        $.__views.index.add($.__views.__alloyId9);
        $.__views.__alloyId10 = Ti.UI.createLabel({
            font: {
                fontSize: "20dp",
                color: "black"
            },
            text: "View Handheld",
            id: "__alloyId10"
        });
        $.__views.__alloyId9.add($.__views.__alloyId10);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;