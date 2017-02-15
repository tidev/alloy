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
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    Alloy.Collections.instance("test");
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.API.info("aloy1127: " + Ti.App.Properties.hasProperty("aloy1127"));
    if (!Ti.App.Properties.hasProperty("aloy1127")) {
        for (var i = 1, j = 7; j > i; i++) Alloy.createModel("test", {
            username: "User " + i
        }).save();
        Ti.App.Properties.setString("aloy1127", "yes");
    }
    Alloy.Collections.test.fetch();
    $.index.addEventListener("open", function() {
        $.destroy();
    });
    $.index.open();
    render();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;