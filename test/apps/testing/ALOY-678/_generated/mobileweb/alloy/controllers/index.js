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
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId1 = {};
    var __alloyId4 = [];
    var __alloyId6 = {
        type: "Ti.UI.View",
        childTemplates: function() {
            var __alloyId7 = [];
            var __alloyId9 = {
                type: "Ti.UI.ImageView",
                bindId: "image",
                properties: {
                    bindId: "image",
                    width: "60",
                    left: "10"
                }
            };
            __alloyId7.push(__alloyId9);
            var __alloyId11 = {
                type: "Ti.UI.View",
                childTemplates: function() {
                    var __alloyId12 = [];
                    var __alloyId14 = {
                        type: "Ti.UI.Label",
                        bindId: "label",
                        properties: {
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE,
                            color: "#000",
                            bindId: "label"
                        }
                    };
                    __alloyId12.push(__alloyId14);
                    return __alloyId12;
                }(),
                properties: {
                    backgroundColor: "#a00",
                    height: "50",
                    width: "130"
                }
            };
            __alloyId7.push(__alloyId11);
            var __alloyId16 = {
                type: "Ti.UI.View",
                childTemplates: function() {
                    var __alloyId17 = [];
                    var __alloyId19 = {
                        type: "Ti.UI.View",
                        childTemplates: function() {
                            var __alloyId20 = [];
                            var __alloyId22 = {
                                type: "Ti.UI.Button",
                                bindId: "button",
                                properties: {
                                    bindId: "button",
                                    height: "40",
                                    width: "50"
                                }
                            };
                            __alloyId20.push(__alloyId22);
                            return __alloyId20;
                        }(),
                        properties: {
                            backgroundColor: "#0f0",
                            height: "50",
                            width: "60"
                        }
                    };
                    __alloyId17.push(__alloyId19);
                    return __alloyId17;
                }(),
                properties: {
                    backgroundColor: "#00f",
                    height: "60",
                    width: "80",
                    right: "10"
                }
            };
            __alloyId7.push(__alloyId16);
            return __alloyId7;
        }(),
        properties: {
            backgroundColor: "#aa0"
        }
    };
    __alloyId4.push(__alloyId6);
    var __alloyId3 = {
        properties: {
            name: "template1",
            height: "70"
        },
        childTemplates: __alloyId4
    };
    __alloyId1["template1"] = __alloyId3;
    var __alloyId24 = [];
    $.__views.__alloyId25 = {
        image: {
            image: "/appc.png"
        },
        label: {
            text: "ugly rows"
        },
        button: {
            title: "Hi"
        },
        properties: {
            id: "__alloyId25"
        }
    };
    __alloyId24.push($.__views.__alloyId25);
    $.__views.__alloyId26 = {
        image: {
            image: "/appc.png"
        },
        label: {
            text: "nested views"
        },
        button: {
            title: "there"
        },
        properties: {
            id: "__alloyId26"
        }
    };
    __alloyId24.push($.__views.__alloyId26);
    $.__views.__alloyId27 = {
        image: {
            image: "/appc.png"
        },
        label: {
            text: '"colorful"'
        },
        button: {
            title: "!"
        },
        properties: {
            id: "__alloyId27"
        }
    };
    __alloyId24.push($.__views.__alloyId27);
    $.__views.section = Ti.UI.createListSection({
        id: "section"
    });
    $.__views.section.items = __alloyId24;
    var __alloyId28 = [];
    __alloyId28.push($.__views.section);
    $.__views.__alloyId0 = Ti.UI.createListView({
        sections: __alloyId28,
        templates: __alloyId1,
        defaultItemTemplate: "template1",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var items = [];
    for (var i = 0; 10 > i; i++) items.push({
        image: {
            image: "/appc.png"
        },
        label: {
            text: "auto-row #" + (i + 1)
        },
        button: {
            title: i + 1
        }
    });
    $.section.items = $.section.items.concat(items);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;