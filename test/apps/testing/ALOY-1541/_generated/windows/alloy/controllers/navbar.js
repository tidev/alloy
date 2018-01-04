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
    this.__controllerPath = "navbar";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var leftNavButtons = [];
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Btn1",
        id: "__alloyId2"
    });
    leftNavButtons.push($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createButton({
        title: "Btn2",
        id: "__alloyId3"
    });
    leftNavButtons.push($.__views.__alloyId3);
    __parentSymbol.leftNavButtons = leftNavButtons;
    $.__views.navbar && $.addTopLevelView($.__views.navbar);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;