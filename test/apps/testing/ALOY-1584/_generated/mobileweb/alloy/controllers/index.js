function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId0() {
        $.__views.index.removeEventListener("open", __alloyId0);
        if ($.__views.index.activity) {
            $.__views.index.activity.setSupportActionBar($.__views.toolBarID);
            $.__views.index.activity.actionBar.displayHomeAsUp = true;
            $.__views.index.activity.actionBar.homeButtonEnabled = true;
        } else {
            Ti.API.warn("You attempted to access an Activity on a lightweight Window or other");
            Ti.API.warn("UI component which does not have an Android activity. Android Activities");
            Ti.API.warn("are valid with only windows in TabGroups or heavyweight Windows.");
        }
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
    $.__views.index = Ti.UI.createWindow({
        title: "My Test App",
        backgroundColor: "gray",
        customToolbar: "toolBarID",
        theme: "Theme.AppCompat.NoTitleBar",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.toolBarID = Ti.UI.createToolbar({
        id: "toolBarID",
        title: "MyMenu",
        subtitle: "Subtitle",
        width: Ti.UI.FILL,
        top: 0,
        homeButtonEnabled: true,
        displayHomeAsUp: true,
        onHomeIconItemSelected: "clickAlert",
        barColor: "#639851"
    });
    $.__views.index.add($.__views.toolBarID);
    $.__views.index.addEventListener("open", __alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;