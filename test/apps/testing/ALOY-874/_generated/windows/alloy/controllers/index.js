function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId14(e) {
        if (e && e.fromAdapter) return;
        __alloyId14.opts || {};
        var models = __alloyId13.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId10 = models[i];
            __alloyId10.__transform = _.isFunction(__alloyId10.transform) ? __alloyId10.transform() : __alloyId10.toJSON();
            var __alloyId12 = Ti.UI.createTableViewRow({
                title: _.template('{m["title"]}', {
                    m: __alloyId10.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            });
            rows.push(__alloyId12);
        }
        $.__views.__alloyId3.setData(rows);
    }
    function __alloyId30(e) {
        if (e && e.fromAdapter) return;
        var opts = __alloyId30.opts || {};
        var models = __alloyId29.models;
        var len = models.length;
        var __alloyId19 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId26 = models[i];
            __alloyId26.__transform = _.isFunction(__alloyId26.transform) ? __alloyId26.transform() : __alloyId26.toJSON();
            var __alloyId28 = {
                properties: {
                    title: _.template('{m["title"]}', {
                        m: __alloyId26.__transform
                    }, {
                        interpolate: /\{([\s\S]+?)\}/g
                    })
                }
            };
            __alloyId19.push(__alloyId28);
        }
        opts.animation ? $.__views.__alloyId18.setItems(__alloyId19, opts.animation) : $.__views.__alloyId18.setItems(__alloyId19);
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
    var __alloyId0 = [];
    $.__views.__alloyId2 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        title: "table",
        id: "__alloyId2"
    });
    $.__views.__alloyId5 = Ti.UI.createView({
        height: 60,
        id: "__alloyId5"
    });
    $.__views.__alloyId6 = Ti.UI.createLabel({
        text: "Header",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.__alloyId8 = Ti.UI.createView({
        height: 60,
        id: "__alloyId8"
    });
    $.__views.__alloyId9 = Ti.UI.createLabel({
        text: "Footer",
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.__alloyId3 = Ti.UI.createTableView({
        headerView: $.__views.__alloyId5,
        footerView: $.__views.__alloyId8,
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    var __alloyId13 = Alloy.Collections["$.test"] || $.test;
    __alloyId13.on("fetch destroy change add remove reset", __alloyId14);
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "table",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId16 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        title: "list",
        id: "__alloyId16"
    });
    $.__views.__alloyId21 = Ti.UI.createView({
        height: 60,
        id: "__alloyId21"
    });
    $.__views.__alloyId22 = Ti.UI.createLabel({
        text: "Header",
        id: "__alloyId22"
    });
    $.__views.__alloyId21.add($.__views.__alloyId22);
    $.__views.__alloyId24 = Ti.UI.createView({
        height: 60,
        id: "__alloyId24"
    });
    $.__views.__alloyId25 = Ti.UI.createLabel({
        text: "Footer",
        id: "__alloyId25"
    });
    $.__views.__alloyId24.add($.__views.__alloyId25);
    $.__views.__alloyId18 = Ti.UI.createListSection({
        headerView: $.__views.__alloyId21,
        footerView: $.__views.__alloyId24,
        id: "__alloyId18"
    });
    var __alloyId29 = Alloy.Collections["$.test"] || $.test;
    __alloyId29.on("fetch destroy change add remove reset", __alloyId30);
    var __alloyId31 = [];
    __alloyId31.push($.__views.__alloyId18);
    $.__views.__alloyId17 = Ti.UI.createListView({
        sections: __alloyId31,
        id: "__alloyId17"
    });
    $.__views.__alloyId16.add($.__views.__alloyId17);
    $.__views.__alloyId15 = Ti.UI.createTab({
        window: $.__views.__alloyId16,
        title: "list",
        id: "__alloyId15"
    });
    __alloyId0.push($.__views.__alloyId15);
    $.__views.index = Ti.UI.createTabGroup({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId13 && __alloyId13.off("fetch destroy change add remove reset", __alloyId14);
        __alloyId29 && __alloyId29.off("fetch destroy change add remove reset", __alloyId30);
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