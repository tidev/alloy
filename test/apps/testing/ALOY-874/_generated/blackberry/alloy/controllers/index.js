function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId13(e) {
        if (e && e.fromAdapter) return;
        __alloyId13.opts || {};
        var models = __alloyId12.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId9 = models[i];
            __alloyId9.__transform = {};
            var __alloyId11 = Ti.UI.createTableViewRow({
                title: "undefined" != typeof __alloyId9.__transform["title"] ? __alloyId9.__transform["title"] : __alloyId9.get("title")
            });
            rows.push(__alloyId11);
        }
        $.__views.__alloyId2.setData(rows);
    }
    function __alloyId29(e) {
        if (e && e.fromAdapter) return;
        var opts = __alloyId29.opts || {};
        var models = __alloyId28.models;
        var len = models.length;
        var __alloyId18 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId25 = models[i];
            __alloyId25.__transform = {};
            var __alloyId27 = {
                properties: {
                    title: "undefined" != typeof __alloyId25.__transform["title"] ? __alloyId25.__transform["title"] : __alloyId25.get("title")
                }
            };
            __alloyId18.push(__alloyId27);
        }
        opts.animation ? $.__views.__alloyId17.setItems(__alloyId18, opts.animation) : $.__views.__alloyId17.setItems(__alloyId18);
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
    $.test = Alloy.createCollection("test");
    $.__views.index = Ti.UI.createTabGroup({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.__alloyId1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        title: "table",
        id: "__alloyId1"
    });
    $.__views.__alloyId4 = Ti.UI.createView({
        height: "60",
        id: "__alloyId4"
    });
    $.__views.__alloyId5 = Ti.UI.createLabel({
        text: "Header",
        id: "__alloyId5"
    });
    $.__views.__alloyId4.add($.__views.__alloyId5);
    $.__views.__alloyId7 = Ti.UI.createView({
        height: "60",
        id: "__alloyId7"
    });
    $.__views.__alloyId8 = Ti.UI.createLabel({
        text: "Footer",
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.__alloyId2 = Ti.UI.createTableView({
        headerView: $.__views.__alloyId4,
        footerView: $.__views.__alloyId7,
        id: "__alloyId2"
    });
    $.__views.__alloyId1.add($.__views.__alloyId2);
    var __alloyId12 = Alloy.Collections["$.test"] || $.test;
    __alloyId12.on("fetch destroy change add remove reset", __alloyId13);
    $.__views.__alloyId0 = Ti.UI.createTab({
        window: $.__views.__alloyId1,
        title: "table",
        id: "__alloyId0"
    });
    $.__views.index.addTab($.__views.__alloyId0);
    $.__views.__alloyId15 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        title: "list",
        id: "__alloyId15"
    });
    $.__views.__alloyId20 = Ti.UI.createView({
        height: "60",
        id: "__alloyId20"
    });
    $.__views.__alloyId21 = Ti.UI.createLabel({
        text: "Header",
        id: "__alloyId21"
    });
    $.__views.__alloyId20.add($.__views.__alloyId21);
    $.__views.__alloyId23 = Ti.UI.createView({
        height: "60",
        id: "__alloyId23"
    });
    $.__views.__alloyId24 = Ti.UI.createLabel({
        text: "Footer",
        id: "__alloyId24"
    });
    $.__views.__alloyId23.add($.__views.__alloyId24);
    $.__views.__alloyId17 = Ti.UI.createListSection({
        headerView: $.__views.__alloyId20,
        footerView: $.__views.__alloyId23,
        id: "__alloyId17"
    });
    var __alloyId28 = Alloy.Collections["$.test"] || $.test;
    __alloyId28.on("fetch destroy change add remove reset", __alloyId29);
    var __alloyId30 = [];
    __alloyId30.push($.__views.__alloyId17);
    $.__views.__alloyId16 = Ti.UI.createListView({
        sections: __alloyId30,
        id: "__alloyId16"
    });
    $.__views.__alloyId15.add($.__views.__alloyId16);
    $.__views.__alloyId14 = Ti.UI.createTab({
        window: $.__views.__alloyId15,
        title: "list",
        id: "__alloyId14"
    });
    $.__views.index.addTab($.__views.__alloyId14);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId12.off("fetch destroy change add remove reset", __alloyId13);
        __alloyId28.off("fetch destroy change add remove reset", __alloyId29);
    };
    _.extend($, $.__views);
    $.index.open();
    $.test.add({
        title: "this is my row"
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;