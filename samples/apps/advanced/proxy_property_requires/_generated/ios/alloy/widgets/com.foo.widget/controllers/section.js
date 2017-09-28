function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.foo.widget/" + s : s.substring(0, index) + "/com.foo.widget/" + s.substring(index + 1);
    return path;
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
    new (require("/alloy/widget"))("com.foo.widget");
    this.__widgetId = "com.foo.widget";
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "section";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.section = Ti.UI.createTableViewSection({
        headerTitle: "Test",
        id: "section"
    });
    $.__views.__alloyId2 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "table row",
        id: "__alloyId2"
    });
    $.__views.section.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "table row",
        id: "__alloyId3"
    });
    $.__views.section.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "table row",
        id: "__alloyId4"
    });
    $.__views.section.add($.__views.__alloyId4);
    $.__views.section && $.addTopLevelView($.__views.section);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;