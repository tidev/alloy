function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doFoo(num) {
        alert("Your rating = " + num);
    }
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
        backgroundColor: "white",
        id: "index",
        title: "Books"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.starwidget = Alloy.createWidget("starrating", "widget", {
        id: "starwidget",
        max: "5",
        initialRating: "2.5",
        top: "20",
        __parentSymbol: $.__views.index
    });
    $.__views.starwidget.setParent($.__views.index);
    $.__views.table = Ti.UI.createTableView({
        id: "table",
        top: "50"
    });
    $.__views.index.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var rows = [];
    var titles = [ "Lord of the Rings", "Harry Potter", "Eragon", "Wheel of Time", "Narnia" ];
    for (var i = 0, j = titles.length; j > i; i++) rows.push(Alloy.createController("row", {
        title: titles[i]
    }).getView());
    $.table.data = rows;
    $.starwidget.init(doFoo);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;