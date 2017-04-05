function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function addLabels(e) {
        $.scroller.add(Ti.UI.createLabel(Alloy.createStyle("index", {
            apiName: "Ti.UI.Label",
            text: "Alloy.createStyle() + Ti.UI.createLabel()"
        })));
        $.scroller.add(Ti.UI.createLabel($.createStyle({
            apiName: "Ti.UI.Label",
            text: "$.createStyle() + Ti.UI.createLabel()"
        })));
        $.scroller.add(Alloy.UI.create("index", "Ti.UI.Label", {
            text: "Alloy.UI.create()"
        }));
        $.scroller.add($.UI.create("Ti.UI.Label", {
            text: "$.UI.create()"
        }));
        $.scroller.add(Alloy.createWidget("alloy.testWidget", "labelmaker").createLabels());
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    addLabels ? $.addListener($.__views.index, "click", addLabels) : __defers["$.__views.index!click!addLabels"] = true;
    $.__views.scroller = Ti.UI.createScrollView({
        layout: "vertical",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "scroller"
    });
    $.__views.index.add($.__views.scroller);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.index!click!addLabels"] && $.addListener($.__views.index, "click", addLabels);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;