function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function loadData(e) {
        if (e && e.fromAdapter) return;
        var opts = loadData.opts || {};
        var models = __alloyId5.models;
        var len = models.length;
        var __alloyId1 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId2 = models[i];
            __alloyId2.__transform = {};
            var __alloyId4 = {
                properties: {
                    title: "undefined" != typeof __alloyId2.__transform["title"] ? __alloyId2.__transform["title"] : __alloyId2.get("title")
                }
            };
            __alloyId1.push(__alloyId4);
        }
        opts.animation ? $.__views.section.setItems(__alloyId1, opts.animation) : $.__views.section.setItems(__alloyId1);
    }
    function doClick(e) {
        0 === e.sectionIndex && 0 === e.itemIndex && info.add({
            title: 0 === ctr++ ? TEXT : "Row #" + ctr
        });
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
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.section = Ti.UI.createListSection({
        id: "section"
    });
    var __alloyId5 = Alloy.Collections["info"] || info;
    __alloyId5.on("fetch destroy change add remove reset", loadData);
    var __alloyId6 = [];
    __alloyId6.push($.__views.section);
    $.__views.__alloyId0 = Ti.UI.createListView({
        sections: __alloyId6,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    doClick ? $.__views.__alloyId0.addEventListener("itemclick", doClick) : __defers["$.__views.__alloyId0!itemclick!doClick"] = true;
    exports.destroy = function() {
        __alloyId5.off("fetch destroy change add remove reset", loadData);
    };
    _.extend($, $.__views);
    var TEXT = "Click me to add more items";
    var info = Alloy.Collections.info;
    var ctr = 0;
    $.section.items = [ {
        properties: {
            title: TEXT
        }
    } ];
    loadData.opts = {
        animation: {
            animated: false
        }
    };
    $.index.open();
    __defers["$.__views.__alloyId0!itemclick!doClick"] && $.__views.__alloyId0.addEventListener("itemclick", doClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;