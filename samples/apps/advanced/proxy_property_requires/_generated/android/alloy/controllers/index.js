function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId25(e) {
        if (e && e.fromAdapter) return;
        __alloyId25.opts || {};
        var models = __alloyId24.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId21 = models[i];
            __alloyId21.__transform = _.isFunction(__alloyId21.transform) ? __alloyId21.transform() : __alloyId21.toJSON();
            var __alloyId23 = Alloy.createWidget("com.foo.widget", "row_bind", {
                $model: __alloyId21
            });
            rows.push(__alloyId23.getViewEx({
                recurse: true
            }));
        }
        $.__views.bindingTable.setData(rows);
    }
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
    var __alloyId7 = [];
    $.__views.staticWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "staticWindow",
        title: "static"
    });
    var __alloyId8 = [];
    $.__views.staticRow1 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow1",
        title: "one"
    });
    __alloyId8.push($.__views.staticRow1);
    $.__views.staticRow2 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow2",
        title: "two"
    });
    __alloyId8.push($.__views.staticRow2);
    $.__views.staticWidgetSection = Alloy.createWidget("com.foo.widget", "section", {
        id: "staticWidgetSection"
    });
    __alloyId8.push($.__views.staticWidgetSection.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow1 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow1"
    });
    __alloyId8.push($.__views.staticWidgetRow1.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow2 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow2"
    });
    __alloyId8.push($.__views.staticWidgetRow2.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow3 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow3"
    });
    __alloyId8.push($.__views.staticWidgetRow3.getViewEx({
        recurse: true
    }));
    $.__views.staticRow3 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow3",
        title: "three"
    });
    __alloyId8.push($.__views.staticRow3);
    $.__views.staticTable = Ti.UI.createTableView({
        data: __alloyId8,
        id: "staticTable"
    });
    $.__views.staticWindow.add($.__views.staticTable);
    $.__views.staticTab = Ti.UI.createTab({
        window: $.__views.staticWindow,
        id: "staticTab",
        title: "static"
    });
    __alloyId7.push($.__views.staticTab);
    $.__views.bindingWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "bindingWindow",
        title: "binding"
    });
    $.__views.bindingTable = Ti.UI.createTableView({
        id: "bindingTable"
    });
    $.__views.bindingWindow.add($.__views.bindingTable);
    var __alloyId24 = Alloy.Collections["dummy"] || dummy;
    __alloyId24.on("fetch destroy change add remove reset", __alloyId25);
    $.__views.bindingTab = Ti.UI.createTab({
        window: $.__views.bindingWindow,
        id: "bindingTab",
        title: "binding"
    });
    __alloyId7.push($.__views.bindingTab);
    $.__views.proxiesWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "proxiesWindow",
        title: "proxy properties"
    });
    $.__views.__alloyId32 = Alloy.createController("proxy", {
        id: "__alloyId32"
    });
    var __alloyId33 = [];
    $.__views.__alloyId34 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId34"
    });
    __alloyId33.push($.__views.__alloyId34);
    $.__views.__alloyId35 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId35"
    });
    __alloyId33.push($.__views.__alloyId35);
    $.__views.__alloyId36 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId36"
    });
    __alloyId33.push($.__views.__alloyId36);
    $.__views.__alloyId37 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId37"
    });
    __alloyId33.push($.__views.__alloyId37);
    $.__views.proxiesTable = Ti.UI.createTableView({
        data: __alloyId33,
        headerPullView: $.__views.__alloyId32.getProxyPropertyEx("headerPullView", {
            recurse: true
        }),
        headerView: $.__views.__alloyId32.getProxyPropertyEx("headerView", {
            recurse: true
        }),
        footerView: $.__views.__alloyId32.getProxyPropertyEx("footerView", {
            recurse: true
        }),
        id: "proxiesTable"
    });
    $.__views.proxiesWindow.add($.__views.proxiesTable);
    $.__views.proxiesTab = Ti.UI.createTab({
        window: $.__views.proxiesWindow,
        id: "proxiesTab",
        title: "proxies"
    });
    __alloyId7.push($.__views.proxiesTab);
    $.__views.windowWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "windowWindow",
        title: "window"
    });
    $.__views.__alloyId38 = Alloy.createController("window", {
        id: "__alloyId38",
        __parentSymbol: $.__views.windowWindow
    });
    $.__views.__alloyId38.setParent($.__views.windowWindow);
    $.__views.__alloyId39 = Ti.UI.createLabel({
        text: "This is a window",
        id: "__alloyId39"
    });
    $.__views.windowWindow.add($.__views.__alloyId39);
    $.__views.windowTab = Ti.UI.createTab({
        window: $.__views.windowWindow,
        id: "windowTab",
        title: "window"
    });
    __alloyId7.push($.__views.windowTab);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId7,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId24 && __alloyId24.off("fetch destroy change add remove reset", __alloyId25);
    };
    _.extend($, $.__views);
    $.index.open();
    Alloy.Collections.dummy.trigger("change");
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;