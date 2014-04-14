function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.foo.widget/" + s : s.substring(0, index) + "/com.foo.widget/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function Controller() {
    new (require("alloy/widget"))("com.foo.widget");
    this.__widgetId = "com.foo.widget";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "section";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.__alloyId3 = Ti.UI.createLabel({
        text: "Test",
        id: "__alloyId3"
    });
    $.__views.section = Ti.UI.createTableViewSection({
        headerView: $.__views.__alloyId3,
        id: "section"
    });
    $.__views.__alloyId4 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "android row",
        id: "__alloyId4"
    });
    $.__views.section.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "android row",
        id: "__alloyId5"
    });
    $.__views.section.add($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "android row",
        id: "__alloyId6"
    });
    $.__views.section.add($.__views.__alloyId6);
    $.__views.section && $.addTopLevelView($.__views.section);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;cWidgetRow1 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow1"
    });
    __alloyId12.push($.__views.staticWidgetRow1.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow2 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow2"
    });
    __alloyId12.push($.__views.staticWidgetRow2.getViewEx({
        recurse: true
    }));
    $.__views.staticWidgetRow3 = Alloy.createWidget("com.foo.widget", "row", {
        id: "staticWidgetRow3"
    });
    __alloyId12.push($.__views.staticWidgetRow3.getViewEx({
        recurse: true
    }));
    $.__views.staticRow3 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "staticRow3",
        title: "3"
    });
    __alloyId12.push($.__views.staticRow3);
    $.__views.staticTable = Ti.UI.createTableView({
        data: __alloyId12,
        id: "staticTable"
    });
    $.__views.staticWindow.add($.__views.staticTable);
    $.__views.staticTab = Ti.UI.createTab({
        window: $.__views.staticWindow,
        id: "staticTab",
        title: "static"
    });
    __alloyId11.push($.__views.staticTab);
    $.__views.bindingWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "bindingWindow",
        title: "binding"
    });
    $.__views.bindingTable = Ti.UI.createTableView({
        id: "bindingTable"
    });
    $.__views.bindingWindow.add($.__views.bindingTable);
    var __alloyId28 = Alloy.Collections["dummy"] || dummy;
    __alloyId28.on("fetch destroy change add remove reset", __alloyId29);
    $.__views.bindingTab = Ti.UI.createTab({
        window: $.__views.bindingWindow,
        id: "bindingTab",
        title: "binding"
    });
    __alloyId11.push($.__views.bindingTab);
    $.__views.proxiesWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "proxiesWindow",
        title: "proxy properties"
    });
    $.__views.__alloyId36 = Alloy.createController("proxy", {
        id: "__alloyId36"
    });
    var __alloyId37 = [];
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
    $.__views.__alloyId41 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "stuff",
        id: "__alloyId41"
    });
    __alloyId37.push($.__views.__alloyId41);
    $.__views.proxiesTable = Ti.UI.createTableView({
        data: __alloyId37,
        headerPullView: $.__views.__alloyId36.getProxyPropertyEx("headerPullView", {
            recurse: true
        }),
        headerView: $.__views.__alloyId36.getProxyPropertyEx("headerView", {
            recurse: true
        }),
        footerView: $.__views.__alloyId36.getProxyPropertyEx("footerView", {
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
    __alloyId11.push($.__views.proxiesTab);
    $.__views.windowWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "windowWindow",
        title: "window"
    });
    $.__views.__alloyId42 = Alloy.createController("window", {
        id: "__alloyId42",
        __parentSymbol: $.__views.windowWindow
    });
    $.__views.__alloyId42.setParent($.__views.windowWindow);
    $.__views.__alloyId43 = Ti.UI.createLabel({
        text: "This is a window",
        id: "__alloyId43"
    });
    $.__views.windowWindow.add($.__views.__alloyId43);
    $.__views.windowTab = Ti.UI.createTab({
        window: $.__views.windowWindow,
        id: "windowTab",
        title: "window"
    });
    __alloyId11.push($.__views.windowTab);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId11,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId28.off("fetch destroy change add remove reset", __alloyId29);
    };
    _.extend($, $.__views);
    $.index.open();
    Alloy.Collections.dummy.trigger("change");
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;