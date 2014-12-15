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
    var __alloyId2 = {};
    var __alloyId5 = [];
    var __alloyId6 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            bindId: "title"
        }
    };
    __alloyId5.push(__alloyId6);
    var __alloyId4 = {
        properties: {
            name: "first"
        },
        childTemplates: __alloyId5
    };
    __alloyId2["first"] = __alloyId4;
    var __alloyId9 = [];
    var __alloyId10 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            bindId: "title"
        }
    };
    __alloyId9.push(__alloyId10);
    var __alloyId11 = {
        type: "Ti.UI.Label",
        bindId: "subtitle",
        properties: {
            bindId: "subtitle"
        }
    };
    __alloyId9.push(__alloyId11);
    var __alloyId8 = {
        properties: {
            name: "second"
        },
        childTemplates: __alloyId9
    };
    __alloyId2["second"] = __alloyId8;
    var __alloyId14 = [];
    var __alloyId15 = {
        type: "Ti.UI.ImageView",
        bindId: "leftImage",
        properties: {
            bindId: "leftImage"
        }
    };
    __alloyId14.push(__alloyId15);
    var __alloyId16 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            bindId: "title"
        }
    };
    __alloyId14.push(__alloyId16);
    var __alloyId17 = {
        type: "Ti.UI.Label",
        bindId: "subtitle",
        properties: {
            bindId: "subtitle"
        }
    };
    __alloyId14.push(__alloyId17);
    var __alloyId13 = {
        properties: {
            name: "third"
        },
        childTemplates: __alloyId14
    };
    __alloyId2["third"] = __alloyId13;
    var __alloyId20 = [];
    $.__views.__alloyId21 = {
        template: "first",
        title: {
            text: "this is some text"
        },
        properties: {
            id: "__alloyId21"
        }
    };
    __alloyId20.push($.__views.__alloyId21);
    $.__views.__alloyId18 = Ti.UI.createListSection({
        id: "__alloyId18"
    });
    $.__views.__alloyId18.items = __alloyId20;
    var __alloyId22 = [];
    __alloyId22.push($.__views.__alloyId18);
    $.__views.__alloyId1 = Ti.UI.createListView({
        sections: __alloyId22,
        templates: __alloyId2,
        id: "__alloyId1"
    });
    $.__views.__alloyId0 = Alloy.createWidget("foo", "widget", {
        id: "__alloyId0",
        children: [ $.__views.__alloyId1 ],
        __parentSymbol: $.__views.index
    });
    $.__views.__alloyId0.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;