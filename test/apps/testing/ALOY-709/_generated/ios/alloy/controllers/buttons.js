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
    this.__controllerPath = "buttons";
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
    $.__views.button1 = Ti.UI.createButton({
        title: "button 1",
        apiName: "Ti.UI.Button",
        id: "button1",
        classes: [ "bob", "lou" ]
    });
    $.__views.button1 && $.addTopLevelView($.__views.button1);
    $.__views.button2 = Ti.UI.createButton({
        title: "button 2",
        apiName: "Ti.UI.Button",
        id: "button2",
        classes: [ "bob", "lou" ]
    });
    $.__views.button2 && $.addTopLevelView($.__views.button2);
    $.__views.button3 = Ti.UI.createButton({
        title: "button 3",
        id: "button3"
    });
    $.__views.button3 && $.addTopLevelView($.__views.button3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    try {
        require("specs/buttons")($);
    } catch (e) {
        Ti.API.warn("no unit tests found for buttons.js");
    }
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;