function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function render(e) {
        if (e && e.fromAdapter) return;
        render.opts || {};
        var models = __alloyId5.models;
        var len = models.length;
        var children = $.__views.content.children;
        for (var d = children.length - 1; d >= 0; d--) $.__views.content.remove(children[d]);
        for (var i = 0; len > i; i++) {
            var __alloyId2 = models[i];
            __alloyId2.__transform = {};
            var __alloyId4 = Ti.UI.createView({});
            $.__views.content.add(__alloyId4);
        }
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
    Alloy.Collections.instance("test");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.content = Ti.UI.createView({
        id: "content",
        dataFunction: "render"
    });
    $.__views.index.add($.__views.content);
    var __alloyId5 = Alloy.Collections["test"] || test;
    __alloyId5.on("fetch destroy change add remove reset", render);
    exports.destroy = function() {
        __alloyId5.off("fetch destroy change add remove reset", render);
    };
    _.extend($, $.__views);
    $.index.open();
    render();
    $.destroy();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;