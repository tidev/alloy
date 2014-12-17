function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "tony.section/" + s : s.substring(0, index) + "/tony.section/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    new (require("alloy/widget"))("tony.section");
    this.__widgetId = "tony.section";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.widget = Ti.UI.createTableViewSection({
        id: "widget"
    });
    $.__views.__alloyId0 = Ti.UI.createTableViewRow({
        title: "row 1",
        id: "__alloyId0"
    });
    $.__views.widget.add($.__views.__alloyId0);
    $.__views.__alloyId1 = Ti.UI.createTableViewRow({
        title: "row 2",
        id: "__alloyId1"
    });
    $.__views.widget.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createTableViewRow({
        title: "row 3",
        id: "__alloyId2"
    });
    $.__views.widget.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createTableViewRow({
        title: "row 4",
        id: "__alloyId3"
    });
    $.__views.widget.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createTableViewRow({
        title: "row 5",
        id: "__alloyId4"
    });
    $.__views.widget.add($.__views.__alloyId4);
    $.__views.widget && $.addTopLevelView($.__views.widget);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;