function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
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
        backgroundColor: "#eee",
        fullscreen: false,
        exitOnClose: true,
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createLabel(function() {
        var o = {};
        Alloy.deepExtend(true, o, {
            color: "#222",
            font: {
                fontSize: "28dp",
                fontWeight: "bold"
            },
            textAlign: "center",
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            top: "15dp"
        });
        Alloy.isHandheld && Alloy.deepExtend(true, o, {
            color: "#a00"
        });
        Alloy.deepExtend(true, o, {
            text: "static label",
            id: "label"
        });
        return o;
    }());
    $.__views.index.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    var labels = [];
    for (var i = 0; 4 > i; i++) {
        var theStyle = Alloy.createStyle("index", {
            apiName: "Label",
            classes: [ "blue", "shadow" ],
            id: "label" + (i + 1),
            textAlign: "left",
            text: "I'm ugly, but styled dynamically!"
        });
        var label = Ti.UI.createLabel(theStyle);
        labels.push(label);
        $.index.add(label);
    }
    try {
        require("specs/index")($, {
            labels: labels
        });
    } catch (e) {
        Ti.API.warn('No unit tests for controller "index"');
    }
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;