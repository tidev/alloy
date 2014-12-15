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
    var __alloyId1 = [];
    var __alloyId2 = {};
    var __alloyId5 = [];
    var __alloyId6 = {
        type: "Ti.UI.Label",
        bindId: "info",
        properties: {
            color: "black",
            font: {
                fontFamily: "Arial",
                fontSize: "20dp",
                fontWeight: "bold"
            },
            left: "10dp",
            top: 0,
            bindId: "info"
        }
    };
    __alloyId5.push(__alloyId6);
    var __alloyId7 = {
        type: "Ti.UI.Label",
        bindId: "es_info",
        properties: {
            color: "gray",
            font: {
                fontFamily: "Arial",
                fontSize: "14dp"
            },
            left: "10dp",
            top: "25dp",
            bindId: "es_info"
        }
    };
    __alloyId5.push(__alloyId7);
    var __alloyId4 = {
        properties: {
            name: "template"
        },
        childTemplates: __alloyId5
    };
    __alloyId2["template"] = __alloyId4;
    var __alloyId10 = [];
    $.__views.__alloyId11 = {
        info: {
            text: "Apple"
        },
        es_info: {
            text: "Manzana"
        },
        properties: {
            id: "__alloyId11"
        }
    };
    __alloyId10.push($.__views.__alloyId11);
    $.__views.__alloyId12 = {
        info: {
            text: "Banana"
        },
        es_info: {
            text: "Banana"
        },
        properties: {
            id: "__alloyId12"
        }
    };
    __alloyId10.push($.__views.__alloyId12);
    $.__views.__alloyId8 = Ti.UI.createListSection({
        headerTitle: "Fruit / Frutas",
        id: "__alloyId8"
    });
    $.__views.__alloyId8.items = __alloyId10;
    var __alloyId13 = [];
    __alloyId13.push($.__views.__alloyId8);
    var __alloyId16 = [];
    $.__views.__alloyId17 = {
        info: {
            text: "Carrot"
        },
        es_info: {
            text: "Zanahoria"
        },
        properties: {
            id: "__alloyId17"
        }
    };
    __alloyId16.push($.__views.__alloyId17);
    $.__views.__alloyId18 = {
        info: {
            text: "Potato"
        },
        es_info: {
            text: "Patata"
        },
        properties: {
            id: "__alloyId18"
        }
    };
    __alloyId16.push($.__views.__alloyId18);
    $.__views.__alloyId14 = Ti.UI.createListSection({
        headerTitle: "Vegetables / Verduras",
        id: "__alloyId14"
    });
    $.__views.__alloyId14.items = __alloyId16;
    __alloyId13.push($.__views.__alloyId14);
    var __alloyId21 = [];
    $.__views.__alloyId22 = {
        info: {
            text: "Corn"
        },
        es_info: {
            text: "Maiz"
        },
        properties: {
            id: "__alloyId22"
        }
    };
    __alloyId21.push($.__views.__alloyId22);
    $.__views.__alloyId23 = {
        info: {
            text: "Rice"
        },
        es_info: {
            text: "Arroz"
        },
        properties: {
            id: "__alloyId23"
        }
    };
    __alloyId21.push($.__views.__alloyId23);
    $.__views.__alloyId19 = Ti.UI.createListSection({
        headerTitle: "Grains / Granos",
        id: "__alloyId19"
    });
    $.__views.__alloyId19.items = __alloyId21;
    __alloyId13.push($.__views.__alloyId19);
    $.__views.listView = Ti.UI.createListView({
        sections: __alloyId13,
        templates: __alloyId2,
        id: "listView",
        defaultItemTemplate: "template"
    });
    __alloyId1.push($.__views.listView);
    var __alloyId26 = [];
    $.__views.__alloyId27 = {
        properties: {
            title: "List item 1",
            id: "__alloyId27"
        }
    };
    __alloyId26.push($.__views.__alloyId27);
    $.__views.__alloyId28 = {
        properties: {
            title: "List item 2",
            id: "__alloyId28"
        }
    };
    __alloyId26.push($.__views.__alloyId28);
    $.__views.__alloyId29 = {
        properties: {
            title: "List item 3",
            id: "__alloyId29"
        }
    };
    __alloyId26.push($.__views.__alloyId29);
    $.__views.__alloyId24 = Ti.UI.createListSection({
        id: "__alloyId24"
    });
    $.__views.__alloyId24.items = __alloyId26;
    var __alloyId30 = [];
    __alloyId30.push($.__views.__alloyId24);
    $.__views.list = Ti.UI.createListView({
        sections: __alloyId30,
        id: "list"
    });
    __alloyId1.push($.__views.list);
    $.__views.__alloyId0 = Ti.UI.createScrollableView({
        views: __alloyId1,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;