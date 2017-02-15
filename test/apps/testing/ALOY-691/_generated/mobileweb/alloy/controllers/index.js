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
        var models = __alloyId7.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId2 = models[i];
            __alloyId2.__transform = _.isFunction(__alloyId2.transform) ? __alloyId2.transform() : __alloyId2.toJSON();
            var __alloyId4 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId4);
            var __alloyId6 = Ti.UI.createView({});
            __alloyId4.add(__alloyId6);
        }
        $.__views.content.setData(rows);
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
    Alloy.Collections.instance("test");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.content = Ti.UI.createTableView({
        id: "content"
    });
    $.__views.index.add($.__views.content);
    var __alloyId7 = Alloy.Collections["test"] || test;
    __alloyId7.on("fetch destroy change add remove reset", render);
    exports.destroy = function() {
        __alloyId7 && __alloyId7.off("fetch destroy change add remove reset", render);
    };
    _.extend($, $.__views);
    $.index.open();
    render();
    $.destroy();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;