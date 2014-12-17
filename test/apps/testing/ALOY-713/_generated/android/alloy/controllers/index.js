function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId30(e) {
        if (e && e.fromAdapter) return;
        __alloyId30.opts || {};
        var models = __alloyId29.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId2 = models[i];
            __alloyId2.__transform = {};
            var __alloyId4 = Ti.UI.createTableViewRow({
                height: "200"
            });
            rows.push(__alloyId4);
            var __alloyId6 = Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: "#000",
                text: "first",
                align: "left",
                left: "10"
            });
            __alloyId4.add(__alloyId6);
            var __alloyId9 = [];
            var __alloyId13 = {
                title: "TAB1"
            };
            __alloyId9.push(__alloyId13);
            var __alloyId14 = {
                title: "undefined" != typeof __alloyId2.__transform["fourth"] ? __alloyId2.__transform["fourth"] : __alloyId2.get("fourth")
            };
            __alloyId9.push(__alloyId14);
            var __alloyId15 = {
                title: "TAB3"
            };
            __alloyId9.push(__alloyId15);
            var __alloyId16 = Ti.UI.iOS.createTabbedBar({
                labels: __alloyId9,
                left: "50",
                top: "10"
            });
            __alloyId4.add(__alloyId16);
            var __alloyId18 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId18);
            var __alloyId20 = Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: "#000",
                text: "second"
            });
            __alloyId18.add(__alloyId20);
            var __alloyId22 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId22);
            var __alloyId24 = Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: "#000",
                text: "third"
            });
            __alloyId22.add(__alloyId24);
            var __alloyId26 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId26);
            var __alloyId28 = Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: "#000",
                text: "fourth"
            });
            __alloyId26.add(__alloyId28);
        }
        $.__views.__alloyId1.setData(rows);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
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
    $.__views.index = Ti.UI.createWindow({
        layout: "horizontal",
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createView({
        backgroundColor: "white",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createTableView({
        top: "10",
        separatorColor: "#ffffff",
        height: "600",
        id: "__alloyId1"
    });
    $.__views.__alloyId0.add($.__views.__alloyId1);
    var __alloyId29 = Alloy.Collections["feed"] || feed;
    __alloyId29.on("fetch destroy change add remove reset", __alloyId30);
    exports.destroy = function() {
        __alloyId29.off("fetch destroy change add remove reset", __alloyId30);
    };
    _.extend($, $.__views);
    $.index.open();
    Alloy.Collections.feed.trigger("change");
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;