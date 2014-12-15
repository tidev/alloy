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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            height: Ti.UI.SIZE,
            width: "90%",
            font: {
                fontSize: "24dp",
                fontWeight: "normal"
            },
            textAlign: "center",
            color: "#0f0"
        });
        Alloy.isHandheld && _.extend(o, {
            color: "#0ff"
        });
        Alloy.isTablet && _.extend(o, {
            color: "#963"
        });
        _.extend(o, {
            text: 'Check the console output and make sure that only styles relevant to the current build platform are listed in the printed array. Note also that the "platform" key has been removed entirely from the "queries" object in conditional styles.',
            id: "label"
        });
        return o;
    }());
    $.__views.index.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    Ti.API.info(JSON.stringify(require("alloy/styles/index")));
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;