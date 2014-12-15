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
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.info = Ti.UI.createLabel({
        color: "#000",
        height: Ti.UI.SIZE,
        width: "250dp",
        top: "15dp",
        textAlign: "center",
        font: {
            fontSize: "18dp",
            fontWeight: "normal"
        },
        text: "Click anything to see its ID style entry",
        id: "info"
    });
    $.__views.index.add($.__views.info);
    $.__views.button1 = Ti.UI.createButton({
        top: "15dp",
        color: "#500",
        height: "70dp",
        width: "250dp",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#500",
        title: "button1",
        id: "button1"
    });
    $.__views.index.add($.__views.button1);
    $.__views.button2 = Ti.UI.createButton({
        top: "15dp",
        color: "#500",
        width: "100dp",
        height: Ti.UI.SIZE,
        title: "button2",
        id: "button2"
    });
    $.__views.index.add($.__views.button2);
    $.__views.button3 = Ti.UI.createButton({
        top: "15dp",
        color: "#500",
        height: "40dp",
        width: "200dp",
        borderRadius: 32,
        borderWidth: 1,
        borderColor: "#0f0",
        title: "button3",
        id: "button3"
    });
    $.__views.index.add($.__views.button3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    var style = require("alloy/styles/index");
    var i, len;
    for (i = 0, len = $.index.children.length; len > i; i++) {
        var child = $.index.children[i];
        child.addEventListener("click", function(e) {
            var id = e.source.id;
            _.each(style, function(o) {
                o.key === id && o.isId && Ti.API.info(JSON.stringify(o));
            });
        });
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;