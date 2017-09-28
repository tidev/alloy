function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doRefresh() {
        alert("refreshed");
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
    $.__views.__alloyId1 = Ti.UI.createRefreshControl({
        tintColor: "red",
        id: "__alloyId1"
    });
    doRefresh ? $.addListener($.__views.__alloyId1, "refreshstart", doRefresh) : __defers["$.__views.__alloyId1!refreshstart!doRefresh"] = true;
    $.__views.__alloyId0 = Ti.UI.createScrollView({
        refreshControl: $.__views.__alloyId1,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        text: "Hello",
        id: "__alloyId2"
    });
    $.__views.__alloyId0.add($.__views.__alloyId2);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.__alloyId1!refreshstart!doRefresh"] && $.addListener($.__views.__alloyId1, "refreshstart", doRefresh);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;