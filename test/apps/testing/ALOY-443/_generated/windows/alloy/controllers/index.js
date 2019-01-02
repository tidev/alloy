function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId13(e) {
        if (e && e.fromAdapter) return;
        __alloyId13.opts || {};
        var models = __alloyId12.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId8 = models[i];
            __alloyId8.__transform = _.isFunction(__alloyId8.transform) ? __alloyId8.transform() : __alloyId8.toJSON();
            var __alloyId9 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId9);
            var __alloyId11 = Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: "#000",
                text: __alloyId8.__transform.title + ", by " + __alloyId8.__transform.author
            });
            __alloyId9.add(__alloyId11);
        }
        $.__views.tableview.setData(rows);
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
    Alloy.Models.instance("book");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        top: 20,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "__alloyId2"
    });
    $.__views.index.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "__alloyId3"
    });
    $.__views.index.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "- Reading List -",
        id: "__alloyId4"
    });
    $.__views.index.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "__alloyId5"
    });
    $.__views.index.add($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "__alloyId6"
    });
    $.__views.index.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "__alloyId7"
    });
    $.__views.index.add($.__views.__alloyId7);
    $.__views.tableview = Ti.UI.createTableView({
        id: "tableview",
        top: 30
    });
    $.__views.index.add($.__views.tableview);
    var __alloyId12 = Alloy.Collections["book"] || book;
    __alloyId12.on("fetch destroy change add remove reset", __alloyId13);
    var __alloyId14 = function() {
        Alloy["Models"]["book"].__transform = _.isFunction(Alloy["Models"]["book"].transform) ? Alloy["Models"]["book"].transform() : Alloy["Models"]["book"].toJSON();
        $.__alloyId2.text = Alloy["Models"]["book"]["__transform"]["title"];
        $.__alloyId3.text = "Written by " + Alloy["Models"]["book"]["__transform"]["author"];
        $.__alloyId5.text = Alloy["Models"]["book"]["__transform"]["title"];
        $.__alloyId6.text = "Written by " + Alloy["Models"]["book"]["__transform"]["author"];
        $.__alloyId7.text = "Title: " + Alloy["Models"]["book"]["__transform"]["title"] + ", by " + Alloy["Models"]["book"]["__transform"]["author"] + " :)";
    };
    Alloy["Models"]["book"].on("fetch change destroy", __alloyId14);
    exports.destroy = function() {
        __alloyId12 && __alloyId12.off("fetch destroy change add remove reset", __alloyId13);
        Alloy["Models"]["book"] && Alloy["Models"]["book"].off("fetch change destroy", __alloyId14);
    };
    _.extend($, $.__views);
    Alloy.Models.book.set({
        title: "The Death of Ivan Ilyich",
        author: "Leo Tolstoy"
    });
    Alloy.Collections.book.trigger("change");
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;