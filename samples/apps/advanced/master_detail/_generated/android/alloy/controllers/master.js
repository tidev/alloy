function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function openDetail(e) {
        $.trigger("detail", e);
    }
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "master";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.master = Ti.UI.createWindow({
        backgroundColor: "#fff",
        navBarHidden: true,
        exitOnClose: true,
        title: "Boxers",
        id: "master"
    });
    $.__views.master && $.addTopLevelView($.__views.master);
    $.__views.header = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "50dp",
        color: "#fff",
        textAlign: "center",
        backgroundColor: "#44f",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        text: "Boxers",
        id: "header"
    });
    $.__views.table = Ti.UI.createTableView({
        headerView: $.__views.header,
        id: "table"
    });
    $.__views.master.add($.__views.table);
    openDetail ? $.addListener($.__views.table, "click", openDetail) : __defers["$.__views.table!click!openDetail"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var data = [];
    _.each(Alloy.Globals.data, function(stats, name) {
        data.push(Alloy.createController("row", {
            name: name,
            nickname: stats.nickname
        }).getView());
    });
    $.table.setData(data);
    require("specs/master")($);
    __defers["$.__views.table!click!openDetail"] && $.addListener($.__views.table, "click", openDetail);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;