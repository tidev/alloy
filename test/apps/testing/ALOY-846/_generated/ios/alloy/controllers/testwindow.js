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
    this.__controllerPath = "testwindow";
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
    $.__views.testwin = Ti.UI.createWindow({
        id: "testwin"
    });
    $.__views.testwin && $.addTopLevelView($.__views.testwin);
    $.__views.__alloyId11 = Ti.UI.createLabel({
        color: "#000",
        text: "Label",
        id: "__alloyId11"
    });
    $.__views.testwin.add($.__views.__alloyId11);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.testwin.addEventListener("click", function() {
        Alloy.Globals.detail_navGroup.open(Alloy.createController("detailWin").getView(), {
            animated: true
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;