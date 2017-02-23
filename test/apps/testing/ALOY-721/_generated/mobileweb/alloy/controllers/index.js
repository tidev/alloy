function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function resetClasses(e) {
        var theClass = classes[index++];
        $.resetClass($.tester, theClass);
        $.currentClasses.text = JSON.stringify(theClass);
        index >= classes.length && (index = 0);
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#ECF0F1",
        fullscreen: false,
        navBarHidden: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        textAlign: "center",
        left: null,
        right: null,
        height: "50dp",
        width: Ti.UI.FILL,
        shadowOffset: {
            x: 0,
            y: 1
        },
        backgroundColor: "#E74C3C",
        color: "#ECF0F1",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        shadowColor: "#888",
        top: 0,
        text: "resetStyle()",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.tester = Ti.UI.createLabel({
        textAlign: "center",
        left: null,
        right: null,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        shadowOffset: {
            x: 0,
            y: 0
        },
        text: "click me to reset classes",
        apiName: "Ti.UI.Label",
        id: "tester",
        classes: []
    });
    $.__views.index.add($.__views.tester);
    resetClasses ? $.addListener($.__views.tester, "click", resetClasses) : __defers["$.__views.tester!click!resetClasses"] = true;
    $.__views.currentClassesHeader = Ti.UI.createLabel({
        textAlign: "center",
        left: null,
        right: null,
        height: "34dp",
        width: Ti.UI.FILL,
        shadowOffset: {
            x: 0,
            y: 1
        },
        backgroundColor: "#E74C3C",
        color: "#ECF0F1",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        shadowColor: "#888",
        bottom: "50dp",
        text: "current classes",
        id: "currentClassesHeader"
    });
    $.__views.index.add($.__views.currentClassesHeader);
    $.__views.currentClasses = Ti.UI.createLabel({
        textAlign: "center",
        left: null,
        right: null,
        height: "50dp",
        width: Ti.UI.FILL,
        shadowOffset: {
            x: 0,
            y: 0
        },
        backgroundColor: "#2980B9",
        color: "#ECF0F1",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        bottom: 0,
        id: "currentClasses"
    });
    $.__views.index.add($.__views.currentClasses);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var index = 0;
    var classes = [ [ "darkblue", "medium" ], [ "darkblue", "medium", "red" ], [ "lightblue", "huge" ], "red small", [ "darkblue", "medium", "left" ], "lightblue small right", "red huge crazyshadow" ];
    resetClasses();
    $.index.open();
    __defers["$.__views.tester!click!resetClasses"] && $.addListener($.__views.tester, "click", resetClasses);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;