function Controller() {
    function __alloyId24() {
        __alloyId24.opts || {};
        var models = __alloyId23.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId21 = models[i];
            __alloyId21.__transform = {};
            var __alloyId22 = Alloy.createWidget("com.foo.widget", "row_bind", {
                $model: __alloyId21
            });
            rows.push(__alloyId22.getViewEx({
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
    var __alloyId12 = [];
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
    var __alloyId13 = [];
    __alloyId13.push($.__views.staticRow1);
    $.__views.staticRow2 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow2",
        title: "2"
    });
    __alloyId13.push($.__views.staticRow2);
    $.__views.staticWidgetSection = Alloy.createWidget("com.foo.widget", "section", {
        id: "staticWidgetSection"
    });
    __alloyId13.push($.__views.staticWidgetSection.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow1 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow1"
    });
    __alloyId13.push($.__views.staticWidgetRow1.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow2 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow2"
    });
    __alloyId13.push($.__views.staticWidgetRow2.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow3 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow3"
    });
    __alloyId13.push($.__views.staticWidgetRow3.getViewEx({
        recurse: true
    }));
    $.__views.staticRow3 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow3",
        title: "3"
    });
    __alloyId13.push($.__views.staticRow3);
    $.__views.staticTable = Ti.UI.createTableView({
        data: __alloyId13,
        id: "staticTable"
    });
    $.__views.staticWindow.add($.__views.staticTable);
    $.__views.staticTab = Ti.UI.createTab({
        window: $.__views.staticWindow,
        id: "staticTab",
        title: "static"
    });
    __alloyId12.push($.__views.staticTab);
    $.__views.bindingWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "bindingWindow",
        title: "binding"
    });
    $.__views.bindingTable = Ti.UI.createTableView({
        id: "bindingTable"
    });
    $.__views.bindingWindow.add($.__views.bindingTable);
    var __alloyId23 = Alloy.Collections["dummy"] || dummy;
    __alloyId23.on("fetch destroy change add remove reset", __alloyId24);
    $.__views.bindingTab = Ti.UI.createTab({
        window: $.__views.bindingWindow,
        id: "bindingTab",
        title: "binding"
    });
    __alloyId12.push($.__views.bindingTab);
    $.__views.proxiesWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "proxiesWindow",
        title: "proxy properties"
    });
    $.__views.__alloyId29 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId29"
    });
    var __alloyId30 = [];
    __alloyId30.push($.__views.__alloyId29);
    $.__views.__alloyId31 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId31"
    });
    __alloyId30.push($.__views.__alloyId31);
    $.__views.__alloyId32 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId32"
    });
    __alloyId30.push($.__views.__alloyId32);
    $.__views.__alloyId33 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId33"
    });
    __alloyId30.push($.__views.__alloyId33);
    $.__views.proxiesTable = Ti.UI.createTableView({
        data: __alloyId30,
        id: "proxiesTable"
    });
    $.__views.proxiesWindow.add($.__views.proxiesTable);
    $.__views.__alloyId25 = Alloy.createController("proxy", {
        id: "__alloyId25",
        __parentSymbol: $.__views.proxiesTable
    });
    $.__views.__alloyId25.setParent($.__views.proxiesTable);
    $.__views.proxiesTab = Ti.UI.createTab({
        window: $.__views.proxiesWindow,
        id: "proxiesTab",
        title: "proxies"
    });
    __alloyId12.push($.__views.proxiesTab);
    $.__views.windowWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "windowWindow",
        title: "window"
    });
    $.__views.__alloyId34 = Alloy.createController("window", {
        id: "__alloyId34",
        __parentSymbol: $.__views.windowWindow
    });
    $.__views.__alloyId34.setParent($.__views.windowWindow);
    $.__views.__alloyId35 = Ti.UI.createLabel({
        text: "This is a window",
        id: "__alloyId35"
    });
    $.__views.windowWindow.add($.__views.__alloyId35);
    $.__views.windowTab = Ti.UI.createTab({
        window: $.__views.windowWindow,
        id: "windowTab",
        title: "window"
    });
    __alloyId12.push($.__views.windowTab);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId12,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId23.off("fetch destroy change add remove reset", __alloyId24);
    };
    _.extend($, $.__views);
    $.index.open();
    Alloy.Collections.dummy.trigger("change");
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;