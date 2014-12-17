function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doTouchstart(e) {
        e.source.backgroundColor = "#333";
        var obj = {};
        switch (label) {
          case "reset":
            break;

          case "template3":
            obj.image = "/alloy.png";

          case "template2":
            obj.subtitle = "this is the subtitle for the item";

          case "template1":
            obj.title = "some title";
            break;

          default:
            Ti.API.warn('invalid template type "' + label + '"');
        }
        $.trigger("buttonClick", _.extend(e, {
            modelObj: obj
        }));
    }
    function doTouchend(e) {
        e.source.backgroundColor = "#a00";
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "button";
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
    var __defers = {};
    $.__views.button = Ti.UI.createView({
        height: "50dp",
        width: "25%",
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#a00",
        id: "button"
    });
    $.__views.button && $.addTopLevelView($.__views.button);
    doTouchstart ? $.__views.button.addEventListener("touchstart", doTouchstart) : __defers["$.__views.button!touchstart!doTouchstart"] = true;
    doTouchend ? $.__views.button.addEventListener("touchend", doTouchend) : __defers["$.__views.button!touchend!doTouchend"] = true;
    $.__views.label = Ti.UI.createLabel({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontSize: "12dp",
            fontWeight: "bold"
        },
        touchEnabled: false,
        id: "label"
    });
    $.__views.button.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var label = args.label || "";
    args.label && ($.label.text = args.label);
    __defers["$.__views.button!touchstart!doTouchstart"] && $.__views.button.addEventListener("touchstart", doTouchstart);
    __defers["$.__views.button!touchend!doTouchend"] && $.__views.button.addEventListener("touchend", doTouchend);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;