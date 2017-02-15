function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function fadeIn(view, duration) {
        anim.fadeIn(view, duration, function() {
            fadeOut(view, duration);
        });
    }
    function fadeOut(view, duration) {
        anim.fadeOut(view, duration, function() {
            fadeIn(view, duration);
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
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
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.view1 = Ti.UI.createView({
        height: 100,
        width: 100,
        backgroundColor: "#f00",
        top: 15,
        opacity: 0,
        id: "view1"
    });
    $.__views.index.add($.__views.view1);
    $.__views.view2 = Ti.UI.createView({
        height: 100,
        width: 100,
        backgroundColor: "#00f",
        bottom: 15,
        opacity: 1,
        id: "view2"
    });
    $.__views.index.add($.__views.view2);
    $.__views.view3 = Ti.UI.createView({
        height: 60,
        width: 200,
        backgroundColor: "#0f0",
        opacity: 1,
        id: "view3"
    });
    $.__views.index.add($.__views.view3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var anim = require("alloy/animation");
    $.index.open();
    fadeIn($.view1, 1e3);
    fadeOut($.view2, 1e3);
    fadeIn($.view3, 2e3);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;