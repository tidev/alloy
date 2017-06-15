function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function openList() {
        $.listWin.open();
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
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.ptr = Ti.UI.createRefreshControl({
        id: "ptr",
        tintColor: "#008"
    });
    var __alloyId0 = [];
    $.__views.__alloyId1 = Ti.UI.createTableViewRow({
        title: "tableview",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createTableViewRow({
        title: "drag down to show refreshControl",
        id: "__alloyId2"
    });
    __alloyId0.push($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createTableViewRow({
        title: "click here to open listview",
        id: "__alloyId3"
    });
    __alloyId0.push($.__views.__alloyId3);
    openList ? $.addListener($.__views.__alloyId3, "click", openList) : __defers["$.__views.__alloyId3!click!openList"] = true;
    $.__views.jobList = Ti.UI.createTableView({
        data: __alloyId0,
        refreshControl: $.__views.ptr,
        id: "jobList"
    });
    $.__views.index.add($.__views.jobList);
    $.__views.listWin = Ti.UI.createWindow({
        id: "listWin"
    });
    $.__views.listWin && $.addTopLevelView($.__views.listWin);
    $.__views.ptr = Ti.UI.createRefreshControl({
        id: "ptr",
        tintColor: "#800"
    });
    var __alloyId6 = [];
    $.__views.__alloyId7 = {
        properties: {
            title: "listview",
            id: "__alloyId7"
        }
    };
    __alloyId6.push($.__views.__alloyId7);
    $.__views.__alloyId8 = {
        properties: {
            title: "drag down to show refreshControl",
            id: "__alloyId8"
        }
    };
    __alloyId6.push($.__views.__alloyId8);
    $.__views.__alloyId4 = Ti.UI.createListSection({
        id: "__alloyId4"
    });
    $.__views.__alloyId4.items = __alloyId6;
    var __alloyId9 = [];
    __alloyId9.push($.__views.__alloyId4);
    $.__views.jobList = Ti.UI.createListView({
        sections: __alloyId9,
        refreshControl: $.__views.ptr,
        id: "jobList"
    });
    $.__views.listWin.add($.__views.jobList);
    openList ? $.addListener($.__views.jobList, "click", openList) : __defers["$.__views.jobList!click!openList"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.__alloyId3!click!openList"] && $.addListener($.__views.__alloyId3, "click", openList);
    __defers["$.__views.jobList!click!openList"] && $.addListener($.__views.jobList, "click", openList);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;