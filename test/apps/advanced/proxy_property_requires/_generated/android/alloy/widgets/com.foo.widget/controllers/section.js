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
    $.__views.section = Ti.UI.createTableViewSection({
        id: "section"
    });
    $.__views.section && $.addTopLevelView($.__views.section);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        text: "Test",
        id: "__alloyId3"
    });
    $.__views.section.headerView = $.__views.__alloyId3;
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
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;