function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId1 = Ti.UI.Android.createSearchView({
        id: "__alloyId1"
    });
    var __alloyId2 = [];
    $.__views.__alloyId5 = Ti.UI.createView({
        backgroundColor: "#a00",
        height: "50dp",
        id: "__alloyId5"
    });
    $.__views.__alloyId7 = Ti.UI.createView({
        backgroundColor: "#0a0",
        height: "50dp",
        id: "__alloyId7"
    });
    $.__views.__alloyId3 = Ti.UI.createTableViewSection({
        headerView: $.__views.__alloyId5,
        footerView: $.__views.__alloyId7,
        id: "__alloyId3"
    });
    __alloyId2.push($.__views.__alloyId3);
    $.__views.__alloyId8 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 1",
        id: "__alloyId8"
    });
    $.__views.__alloyId3.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 2",
        id: "__alloyId9"
    });
    $.__views.__alloyId3.add($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 3",
        id: "__alloyId10"
    });
    $.__views.__alloyId3.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createTableViewSection({
        headerTitle: "Section 2",
        id: "__alloyId11"
    });
    __alloyId2.push($.__views.__alloyId11);
    $.__views.__alloyId12 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 1",
        id: "__alloyId12"
    });
    $.__views.__alloyId11.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 2",
        id: "__alloyId13"
    });
    $.__views.__alloyId11.add($.__views.__alloyId13);
    $.__views.__alloyId14 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 3",
        id: "__alloyId14"
    });
    $.__views.__alloyId11.add($.__views.__alloyId14);
    $.__views.__alloyId15 = Ti.UI.createTableViewSection({
        headerTitle: "Section 3",
        id: "__alloyId15"
    });
    __alloyId2.push($.__views.__alloyId15);
    $.__views.__alloyId16 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 1",
        id: "__alloyId16"
    });
    $.__views.__alloyId15.add($.__views.__alloyId16);
    $.__views.__alloyId17 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 2",
        id: "__alloyId17"
    });
    $.__views.__alloyId15.add($.__views.__alloyId17);
    $.__views.__alloyId18 = Ti.UI.createTableViewRow({
        height: "50dp",
        title: "Row 3",
        id: "__alloyId18"
    });
    $.__views.__alloyId15.add($.__views.__alloyId18);
    $.__views.__alloyId0 = Ti.UI.createTableView({
        data: __alloyId2,
        search: $.__views.__alloyId1,
        filterAttribute: "title",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;