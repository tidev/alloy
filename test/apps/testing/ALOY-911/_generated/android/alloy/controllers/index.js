function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doClick() {
        alert("I was clicked");
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
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.headerView = Ti.UI.createLabel({
        backgroundColor: "#3498db",
        height: "50dp",
        width: Ti.UI.FILL,
        color: "#fff",
        font: {
            fontSize: "32dp",
            fontWeight: "bold"
        },
        textAlign: "center",
        text: "header view",
        id: "headerView"
    });
    var __alloyId1 = [];
    $.__views.__alloyId2 = Ti.UI.createTableViewRow({
        id: "__alloyId2"
    });
    __alloyId1.push($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        left: "15dp",
        height: "46dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        color: "#2c3e50",
        text: "row 1",
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createTableViewRow({
        id: "__alloyId4"
    });
    __alloyId1.push($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createLabel({
        left: "15dp",
        height: "46dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        color: "#2c3e50",
        text: "row 2",
        id: "__alloyId5"
    });
    $.__views.__alloyId4.add($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createTableViewRow({
        id: "__alloyId6"
    });
    __alloyId1.push($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        left: "15dp",
        height: "46dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        color: "#2c3e50",
        text: "row 3",
        id: "__alloyId7"
    });
    $.__views.__alloyId6.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createTableViewRow({
        id: "__alloyId8"
    });
    __alloyId1.push($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createLabel({
        left: "15dp",
        height: "46dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        color: "#2c3e50",
        text: "row 4",
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.table = Ti.UI.createTableView({
        top: 0,
        bottom: "100dp",
        separatorColor: "#95a5a6",
        data: __alloyId1,
        headerView: $.__views.headerView,
        touchEnabled: true,
        id: "table"
    });
    $.__views.index.add($.__views.table);
    doClick ? $.addListener($.__views.table, "click", doClick) : __defers["$.__views.table!click!doClick"] = true;
    $.__views.untouchable = Ti.UI.createView({
        height: "100dp",
        backgroundColor: "red",
        bottom: 0,
        touchEnabled: false,
        id: "untouchable"
    });
    $.__views.index.add($.__views.untouchable);
    doClick ? $.addListener($.__views.untouchable, "click", doClick) : __defers["$.__views.untouchable!click!doClick"] = true;
    $.__views.untouchableLabel = Ti.UI.createLabel({
        font: {
            fontSize: "24dp",
            fontWeight: "normal"
        },
        color: "#fff",
        textAlign: "center",
        text: "i won't respond to clicks",
        touchEnabled: false,
        id: "untouchableLabel"
    });
    $.__views.untouchable.add($.__views.untouchableLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.table!click!doClick"] && $.addListener($.__views.table, "click", doClick);
    __defers["$.__views.untouchable!click!doClick"] && $.addListener($.__views.untouchable, "click", doClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;