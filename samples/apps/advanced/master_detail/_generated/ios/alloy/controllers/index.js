function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
    if (Alloy.isTablet) {
        $.__views.master = Alloy.createController("master", {
            id: "master"
        });
        $.__views.detail = Alloy.createController("detail", {
            id: "detail"
        });
        $.__views.index = Ti.UI.iOS.createSplitWindow({
            masterView: $.__views.master.getViewEx({
                recurse: true
            }),
            detailView: $.__views.detail.getViewEx({
                recurse: true
            }),
            id: "index"
        });
        $.__views.index && $.addTopLevelView($.__views.index);
    }
    if (!Alloy.isTablet) {
        $.__views.master = Alloy.createController("master", {
            id: "master"
        });
        $.__views.index = Ti.UI.iOS.createNavigationWindow({
            backgroundColor: "#fff",
            window: $.__views.master.getViewEx({
                recurse: true
            }),
            id: "index"
        });
        $.__views.index && $.addTopLevelView($.__views.index);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.isHandheld && (Alloy.Globals.navgroup = $.index);
    $.master.on("detail", function(e) {
        var controller = Alloy.isTablet ? $.detail : Alloy.createController("detail");
        var win = controller.getView();
        controller.setBoxerStats(e.row.fighterName);
        Alloy.isHandheld && Alloy.Globals.navgroup.openWindow(win);
    });
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;