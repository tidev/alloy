function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    if (true && Alloy.isTablet) {
        $.__views.master = Alloy.createController("master", {
            id: "master"
        });
        $.__views.detail = Alloy.createController("detail", {
            id: "detail"
        });
        $.__views.index = Ti.UI.iPad.createSplitWindow({
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
    if (true && !Alloy.isTablet) {
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
    true && Alloy.isHandheld && (Alloy.Globals.navgroup = $.index);
    $.master.on("detail", function(e) {
        var controller = true && Alloy.isTablet ? $.detail : Alloy.createController("detail");
        var win = controller.getView();
        controller.setBoxerStats(e.row.fighterName);
        true && Alloy.isHandheld && Alloy.Globals.navgroup.openWindow(win);
    });
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;