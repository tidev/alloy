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
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createLabel({
        text: L("tester", "nothing assigned yet"),
        color: "#000",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        id: "label"
    });
    $.__views.index.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    Ti.Locale.getString("foo");
    Titanium.Locale.getString("foo1good");
    L("found_me");
    var foo = "tooooooo";
    Titanium.Locale.getString(foo);
    L("hi" + foo + "there");
    L("OMG****");
    L("foo%ipod");
    Ti.Locale.getString("123badvalue");
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;