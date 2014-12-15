function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId12(e) {
        if (e && e.fromAdapter) return;
        var opts = __alloyId12.opts || {};
        var models = __alloyId11.models;
        var len = models.length;
        var __alloyId7 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId8 = models[i];
            __alloyId8.__transform = {};
            var __alloyId10 = {
                template: "template",
                title: {
                    text: "undefined" != typeof __alloyId8.__transform["title"] ? __alloyId8.__transform["title"] : __alloyId8.get("title")
                },
                properties: {
                    searchableText: "undefined" != typeof __alloyId8.__transform["title"] ? __alloyId8.__transform["title"] : __alloyId8.get("title")
                }
            };
            __alloyId7.push(__alloyId10);
        }
        opts.animation ? $.__views.main.setItems(__alloyId7, opts.animation) : $.__views.main.setItems(__alloyId7);
    }
    function randomString(length) {
        length = length || 8;
        var result = "";
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
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
    Alloy.Collections.instance("rows");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId2 = {};
    var __alloyId5 = [];
    var __alloyId6 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#000",
            bindId: "title",
            left: "5"
        }
    };
    __alloyId5.push(__alloyId6);
    var __alloyId4 = {
        properties: {
            name: "template"
        },
        childTemplates: __alloyId5
    };
    __alloyId2["template"] = __alloyId4;
    $.__views.main = Ti.UI.createListSection({
        id: "main"
    });
    var __alloyId11 = Alloy.Collections["rows"] || rows;
    __alloyId11.on("fetch destroy change add remove reset", __alloyId12);
    var __alloyId13 = [];
    __alloyId13.push($.__views.main);
    $.__views.listView = Ti.UI.createListView({
        sections: __alloyId13,
        templates: __alloyId2,
        searchView: $.__views.searchList,
        id: "listView",
        top: "0",
        defaultItemTemplate: "template"
    });
    $.__views.index.add($.__views.listView);
    exports.destroy = function() {
        __alloyId11.off("fetch destroy change add remove reset", __alloyId12);
    };
    _.extend($, $.__views);
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (!Ti.App.Properties.hasProperty("lvsearch")) {
        for (var i = 1, j = 30; j > i; i++) Alloy.createModel("rows", {
            title: randomString()
        }).save();
        Ti.App.Properties.setString("lvsearch", "yes");
    }
    Alloy.Collections.rows.fetch();
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;