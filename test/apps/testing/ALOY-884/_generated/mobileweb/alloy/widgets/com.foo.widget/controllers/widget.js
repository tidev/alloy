function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.foo.widget/" + s : s.substring(0, index) + "/com.foo.widget/" + s.substring(index + 1);
    return path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    new (require("/alloy/widget"))("com.foo.widget");
    this.__widgetId = "com.foo.widget";
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.widget = Ti.UI.createView({
        id: "widget"
    });
    $.__views.widget && $.addTopLevelView($.__views.widget);
    $.__views.t = Ti.UI.createLabel({
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: "Click a button to display something",
        color: "red",
        id: "t"
    });
    $.__views.widget.add($.__views.t);
    $.__views.hl = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: "100",
        id: "hl"
    });
    $.__views.widget.add($.__views.hl);
    $.__views.a = Ti.UI.createButton({
        title: "A",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        id: "a"
    });
    $.__views.hl.add($.__views.a);
    $.__views.b = Ti.UI.createButton({
        title: "B",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        id: "b"
    });
    $.__views.hl.add($.__views.b);
    $.__views.c = Ti.UI.createButton({
        title: "C",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        id: "c"
    });
    $.__views.hl.add($.__views.c);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.a.addEventListener("click", function() {
        $.t.text = "You clicked A";
    });
    $.b.addEventListener("click", function() {
        $.t.text = "You clicked B";
    });
    $.c.addEventListener("click", function() {
        $.t.text = "You clicked C";
    });
    exports.setText = function(text) {
        $.t.text = text;
    };
    exports.getText = function() {
        return $.t.text;
    };
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;