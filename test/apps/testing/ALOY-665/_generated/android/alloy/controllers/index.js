function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doSwipe(e) {
        Ti.API.info("swipe: " + e.direction);
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
        backgroundColor: "#efefef",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    try {
        $.addListener($.__views.index, "touchstart", touch.start);
    } catch (e) {
        __defers["$.__views.index!touchstart!touch.start"] = true;
    }
    try {
        $.addListener($.__views.index, "touchend", touch["end"].func);
    } catch (e) {
        __defers["$.__views.index!touchend!touch['end'].func"] = true;
    }
    doSwipe ? $.addListener($.__views.index, "swipe", doSwipe) : __defers["$.__views.index!swipe!doSwipe"] = true;
    $.__views.label = Ti.UI.createLabel({
        touchEnabled: false,
        color: "#000",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        text: "touch and swipe",
        id: "label"
    });
    $.__views.index.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var touch = {
        start: function(e) {
            Ti.API.info("touchstart");
        },
        end: {
            func: function(e) {
                Ti.API.info("touchend");
            }
        }
    };
    $.index.open();
    __defers["$.__views.index!touchstart!touch.start"] && $.addListener($.__views.index, "touchstart", touch.start);
    __defers["$.__views.index!touchend!touch['end'].func"] && $.addListener($.__views.index, "touchend", touch["end"].func);
    __defers["$.__views.index!swipe!doSwipe"] && $.addListener($.__views.index, "swipe", doSwipe);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;