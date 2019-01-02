function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId7(e) {
        if (e && e.fromAdapter) return;
        __alloyId7.opts || {};
        var models = __alloyId6.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId1 = models[i];
            __alloyId1.__transform = _.isFunction(__alloyId1.transform) ? __alloyId1.transform() : __alloyId1.toJSON();
            var __alloyId3 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId3);
            var __alloyId5 = Alloy.createWidget("foo", "widget", {
                $model: __alloyId1,
                __parentSymbol: __alloyId3
            });
            __alloyId5.setParent(__alloyId3);
            onCustomEvent ? __alloyId5.on("customevent", onCustomEvent) : __defers["__alloyId5!customevent!onCustomEvent"] = true;
        }
        $.__views.__alloyId0.setData(rows);
    }
    function onCustomEvent(e) {
        console.log("Congratulations! It works!");
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
    var __defers = {};
    $.demo = Alloy.createCollection("Demo");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createTableView({
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    var __alloyId6 = Alloy.Collections["$.demo"] || $.demo;
    __alloyId6.on("fetch destroy change add remove reset", __alloyId7);
    exports.destroy = function() {
        __alloyId6 && __alloyId6.off("fetch destroy change add remove reset", __alloyId7);
    };
    _.extend($, $.__views);
    var demoModel = Alloy.createModel("Demo");
    $.demo.add(demoModel);
    $.index.open();
    __defers["__alloyId5!customevent!onCustomEvent"] && __alloyId5.on("customevent", onCustomEvent);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;