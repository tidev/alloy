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
        top: "20dp",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId1 = {};
    var __alloyId4 = [];
    ({
        type: "Ti.UI.Label",
        bindId: "lHintText",
        properties: {
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            textAlign: "left",
            color: "#000",
            bottom: 0,
            font: {
                fontSize: 10,
                fontWeight: "bold"
            },
            bindId: "lHintText"
        }
    });
    var __alloyId8 = {
        type: "Ti.UI.TextArea",
        bindId: "cMsg",
        childTemplates: function() {
            var __alloyId9 = [];
            var __alloyId10 = {
                type: "Ti.UI.Label",
                bindId: "lHintText",
                properties: {
                    height: Ti.UI.SIZE,
                    width: Ti.UI.FILL,
                    textAlign: "left",
                    color: "#000",
                    bottom: 0,
                    font: {
                        fontSize: 10,
                        fontWeight: "bold"
                    },
                    bindId: "lHintText"
                }
            };
            __alloyId9.push(__alloyId10);
            return __alloyId9;
        }(),
        properties: {
            height: "30",
            width: Ti.UI.FILL,
            textAlign: "left",
            left: 10,
            font: {
                fontSize: 12,
                fontWeight: "bold"
            },
            bindId: "cMsg"
        }
    };
    __alloyId4.push(__alloyId8);
    var __alloyId3 = {
        properties: {
            name: "tMsg"
        },
        childTemplates: __alloyId4
    };
    __alloyId1["tMsg"] = __alloyId3;
    var __alloyId13 = [];
    ({
        type: "Ti.UI.Label",
        bindId: "lHintText",
        properties: {
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            textAlign: "left",
            color: "#000",
            bottom: 0,
            font: {
                fontSize: 10,
                fontWeight: "bold"
            },
            bindId: "lHintText"
        }
    });
    var __alloyId17 = {
        type: "Ti.UI.TextField",
        bindId: "cMsg",
        childTemplates: function() {
            var __alloyId18 = [];
            var __alloyId19 = {
                type: "Ti.UI.Label",
                bindId: "lHintText",
                properties: {
                    height: Ti.UI.SIZE,
                    width: Ti.UI.FILL,
                    textAlign: "left",
                    color: "#000",
                    bottom: 0,
                    font: {
                        fontSize: 10,
                        fontWeight: "bold"
                    },
                    bindId: "lHintText"
                }
            };
            __alloyId18.push(__alloyId19);
            return __alloyId18;
        }(),
        properties: {
            height: "30",
            width: Ti.UI.FILL,
            textAlign: "left",
            left: 10,
            font: {
                fontSize: 12,
                fontWeight: "bold"
            },
            bindId: "cMsg"
        }
    };
    __alloyId13.push(__alloyId17);
    var __alloyId12 = {
        properties: {
            name: "fMsg"
        },
        childTemplates: __alloyId13
    };
    __alloyId1["fMsg"] = __alloyId12;
    var __alloyId22 = [];
    $.__views.__alloyId23 = {
        properties: {
            itemId: "liMessage",
            id: "__alloyId23"
        },
        template: "tMsg",
        cMsg: {
            value: "TEXTAREA"
        },
        lHintText: {
            text: "CHILD LABEL"
        }
    };
    __alloyId22.push($.__views.__alloyId23);
    $.__views.__alloyId24 = {
        properties: {
            itemId: "liMessage",
            id: "__alloyId24"
        },
        template: "fMsg",
        cMsg: {
            value: "TEXTFIELD"
        },
        lHintText: {
            text: "CHILD LABEL"
        }
    };
    __alloyId22.push($.__views.__alloyId24);
    $.__views.__alloyId20 = Ti.UI.createListSection({
        id: "__alloyId20"
    });
    $.__views.__alloyId20.items = __alloyId22;
    var __alloyId25 = [];
    __alloyId25.push($.__views.__alloyId20);
    $.__views.__alloyId0 = Ti.UI.createListView({
        sections: __alloyId25,
        templates: __alloyId1,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;