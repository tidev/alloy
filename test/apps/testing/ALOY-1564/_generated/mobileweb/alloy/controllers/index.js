function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId5(e) {
        if (e && e.fromAdapter) return;
        __alloyId5.opts || {};
        var models = __alloyId4.models;
        var len = models.length;
        var children = $.__views.__alloyId0.children;
        for (var d = children.length - 1; d >= 0; d--) $.__views.__alloyId0.remove(children[d]);
        for (var i = 0; len > i; i++) {
            var __alloyId1 = models[i];
            __alloyId1.__transform = _.isFunction(__alloyId1.transform) ? __alloyId1.transform() : __alloyId1.toJSON();
            var __alloyId3 = Alloy.createController("products", {
                $model: __alloyId1,
                __parentSymbol: $.__views.__alloyId0
            });
            __alloyId3.setParent($.__views.__alloyId0);
            doSomething ? __alloyId3.on("click", doSomething) : __defers["__alloyId3!click!doSomething"] = true;
        }
    }
    function doSomething() {
        console.log("Congratulations! It works!");
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
    var __defers = {};
    $.demo = Alloy.createCollection("Demo");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createScrollView({
        layout: "vertical",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    var __alloyId4 = Alloy.Collections["$.demo"] || $.demo;
    __alloyId4.on("fetch destroy change add remove reset", __alloyId5);
    exports.destroy = function() {
        __alloyId4 && __alloyId4.off("fetch destroy change add remove reset", __alloyId5);
    };
    _.extend($, $.__views);
    var demoModel = Alloy.createModel("Demo");
    $.demo.add(demoModel);
    $.index.open();
    __defers["__alloyId3!click!doSomething"] && __alloyId3.on("click", doSomething);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;