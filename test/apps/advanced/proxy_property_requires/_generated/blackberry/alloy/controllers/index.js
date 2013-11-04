function Controller() {
    function __alloyId28() {
        __alloyId28.opts || {};
        var models = __alloyId27.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId24 = models[i];
            __alloyId24.__transform = {};
            var __alloyId26 = Alloy.createWidget("com.foo.widget", "row_bind", {
                $model: __alloyId24
            });
            rows.push(__alloyId26.getViewEx({
                recurse: true
            }));
        }
        $.__views.bindingTable.setData(rows);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.staticWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "staticWindow",
        title: "static"
    });
    $.__views.staticRow1 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow1",
        title: "1"
    });
    var __alloyId11 = [];
    __alloyId11.push($.__views.staticRow1);
    $.__views.staticRow2 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow2",
        title: "2"
    });
    __alloyId11.push($.__views.staticRow2);
    $.__views.staticWidgetSection = Alloy.createWidget("com.foo.widget", "section", {
        id: "staticWidgetSection"
    });
    __alloyId11.push($.__views.staticWidgetSection.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow1 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow1"
    });
    __alloyId11.push($.__views.staticWidgetRow1.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow2 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow2"
    });
    __alloyId11.push($.__views.staticWidgetRow2.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow3 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow3"
    });
    __alloyId11.push($.__views.staticWidgetRow3.getViewEx({
        recurse: true
    }));
    $.__views.staticRow3 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow3",
        title: "3"
    });
    __alloyId11.push($.__views.staticRow3);
    $.__views.staticTable = Ti.UI.createTableView({
        data: __alloyId11,
        id: "staticTable"
    });
    $.__views.staticWindow.add($.__views.staticTable);
    $.__views.staticTab = Ti.UI.createTab({
        window: $.__views.staticWindow,
        id: "staticTab",
        title: "static"
    });
    $.__views.index.addTab($.__views.staticTab);
    $.__views.bindingWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "bindingWindow",
        title: "binding"
    });
    $.__views.bindingTable = Ti.UI.createTableView({
        id: "bindingTable"
    });
    $.__views.bindingWindow.add($.__views.bindingTable);
    var __alloyId27 = Alloy.Collections["dummy"] || dummy;
    __alloyId27.on("fetch destroy change add remove reset", __alloyId28);
    $.__views.bindingTab = Ti.UI.createTab({
        window: $.__views.bindingWindow,
        id: "bindingTab",
        title: "binding"
    });
    $.__views.index.addTab($.__views.bindingTab);
    $.__views.proxiesWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "proxiesWindow",
        title: "proxy properties"
    });
    $.__views.__alloyId32 = Alloy.createController("proxy", {
        id: "__alloyId32"
    });
    $.__views.__alloyId36 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId36"
    });
    var __alloyId37 = [];
    __alloyId37.push($.__views.__alloyId36);
    $.__views.__alloyId38 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId38"
    });
    __alloyId37.push($.__views.__alloyId38);
    $.__views.__alloyId39 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId39"
    });
    __alloyId37.push($.__views.__alloyId39);
    $.__views.__alloyId40 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId40"
    });
    __alloyId37.push($.__views.__alloyId40);
    $.__views.proxiesTable = Ti.UI.createTableView({
        data: __alloyId37,
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
    $.__views.index.addTab($.__views.proxiesTab);
    $.__views.windowWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "windowWindow",
        title: "window"
    });
    $.__views.__alloyId41 = Alloy.createController("window", {
        id: "__alloyId41",
        __parentSymbol: $.__views.windowWindow
    });
    $.__views.__alloyId41.setParent($.__views.windowWindow);
    $.__views.__alloyId42 = Ti.UI.createLabel({
        text: "This is a window",
        id: "__alloyId42"
    });
    $.__views.windowWindow.add($.__views.__alloyId42);
    $.__views.windowTab = Ti.UI.createTab({
        window: $.__views.windowWindow,
        id: "windowTab",
        title: "window"
    });
    $.__views.index.addTab($.__views.windowTab);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId27.off("fetch destroy change add remove reset", __alloyId28);
    };
    _.extend($, $.__views);
    $.index.open();
    Alloy.Collections.dummy.trigger("change");
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;