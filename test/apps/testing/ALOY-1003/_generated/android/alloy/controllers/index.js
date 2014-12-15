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
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId0 = {};
    var __alloyId3 = [];
    var __alloyId5 = {
        type: "Ti.UI.Label",
        bindId: "type",
        properties: {
            bindId: "type"
        }
    };
    __alloyId3.push(__alloyId5);
    var __alloyId2 = {
        properties: {
            name: "template",
            height: "25"
        },
        childTemplates: __alloyId3
    };
    __alloyId0["template"] = __alloyId2;
    var __alloyId7 = [];
    $.__views.__alloyId8 = {
        template: "template",
        type: {
            text: "... Hello ..."
        },
        properties: {
            id: "__alloyId8"
        }
    };
    __alloyId7.push($.__views.__alloyId8);
    $.__views.section = Ti.UI.createListSection({
        id: "section"
    });
    $.__views.section.items = __alloyId7;
    var __alloyId9 = [];
    __alloyId9.push($.__views.section);
    $.__views.list = Ti.UI.createListView({
        top: 20,
        bottom: "50dp",
        sections: __alloyId9,
        templates: __alloyId0,
        id: "list"
    });
    $.__views.index.add($.__views.list);
    $.__views.__alloyId10 = Ti.UI.createView({
        id: "__alloyId10"
    });
    $.__views.index.add($.__views.__alloyId10);
    $.__views.picker = Ti.UI.createPicker({
        value: new Date("Mon May 26 2014 00:00:00 GMT-0400 (EDT)"),
        top: 200,
        minDate: new Date("Fri Feb 08 2013 04:30:26 GMT-0500 (EST)"),
        maxDate: new Date("Tue Nov 17 2015 00:00:00 GMT-0500 (EST)"),
        format24: false,
        calendarViewShown: false,
        id: "picker",
        type: Ti.UI.PICKER_TYPE_DATE
    });
    $.__views.__alloyId10.add($.__views.picker);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var moreItems = [];
    for (var i = 0; 5 > i; i++) moreItems.push({
        template: "template",
        type: {
            text: "row " + i
        }
    });
    $.list.sections[0].items = $.list.sections[0].items.concat(moreItems);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;