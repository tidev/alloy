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
        backgroundColor: "white",
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId0 = [];
    $.__views.row1 = Ti.UI.createTableViewRow({
        font: {
            fontSize: "16dp"
        },
        color: "black",
        id: "row1",
        title: "Row 1 - iOS and Android"
    });
    __alloyId0.push($.__views.row1);
    $.__views.row2 = Ti.UI.createTableViewRow({
        font: {
            fontSize: "16dp"
        },
        color: "black",
        id: "row2",
        title: "Row 2 - Android and Mobileweb"
    });
    __alloyId0.push($.__views.row2);
    $.__views.container = Ti.UI.createTableView({
        data: __alloyId0,
        id: "container",
        top: "30"
    });
    $.__views.index.add($.__views.container);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;