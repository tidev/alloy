function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId27(e) {
        if (e && e.fromAdapter) return;
        var opts = __alloyId27.opts || {};
        var models = __alloyId26.models;
        var len = models.length;
        var __alloyId22 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId23 = models[i];
            __alloyId23.__transform = doTransform(__alloyId23);
            var __alloyId25 = {
                template: "undefined" != typeof __alloyId23.__transform["template"] ? __alloyId23.__transform["template"] : __alloyId23.get("template"),
                title: {
                    text: "undefined" != typeof __alloyId23.__transform["title"] ? __alloyId23.__transform["title"] : __alloyId23.get("title")
                },
                subtitle: {
                    text: "undefined" != typeof __alloyId23.__transform["subtitle"] ? __alloyId23.__transform["subtitle"] : __alloyId23.get("subtitle")
                },
                image: {
                    image: "undefined" != typeof __alloyId23.__transform["image"] ? __alloyId23.__transform["image"] : __alloyId23.get("image")
                }
            };
            __alloyId22.push(__alloyId25);
        }
        opts.animation ? $.__views.section.setItems(__alloyId22, opts.animation) : $.__views.section.setItems(__alloyId22);
    }
    function doTransform(model) {
        var o = model.toJSON();
        o.template = o.subtitle ? o.image ? "fullItem" : "titleAndSub" : "title";
        return o;
    }
    function doButtonClick(e) {
        if (_.isEmpty(e.modelObj)) {
            var db = Ti.Database.open("_alloy_");
            db.execute("DELETE FROM info;");
            db.close();
            info.fetch();
        } else {
            var model = Alloy.createModel("info", e.modelObj);
            info.add(model);
            model.save();
        }
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
    var __alloyId0 = {};
    var __alloyId3 = [];
    var __alloyId5 = {
        type: "Ti.UI.ImageView",
        bindId: "image",
        properties: {
            left: "10dp",
            top: "10dp",
            height: "50dp",
            width: "50dp",
            bindId: "image"
        }
    };
    __alloyId3.push(__alloyId5);
    var __alloyId7 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            left: "70dp",
            right: "10dp",
            top: "10dp",
            font: {
                fontSize: "18dp",
                fontWeight: "bold"
            },
            height: "30dp",
            color: "#222",
            textAlign: "left",
            bindId: "title"
        }
    };
    __alloyId3.push(__alloyId7);
    var __alloyId9 = {
        type: "Ti.UI.Label",
        bindId: "subtitle",
        properties: {
            left: "70dp",
            right: "10dp",
            bottom: "10dp",
            font: {
                fontSize: "12dp",
                fontWeight: "normal"
            },
            height: "20dp",
            color: "#444",
            textAlign: "left",
            bindId: "subtitle"
        }
    };
    __alloyId3.push(__alloyId9);
    var __alloyId2 = {
        properties: {
            name: "fullItem",
            height: "70"
        },
        childTemplates: __alloyId3
    };
    __alloyId0["fullItem"] = __alloyId2;
    var __alloyId12 = [];
    var __alloyId14 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            left: "10dp",
            right: "10dp",
            top: "10dp",
            font: {
                fontSize: "18dp",
                fontWeight: "bold"
            },
            height: "30dp",
            color: "#222",
            textAlign: "left",
            bindId: "title"
        }
    };
    __alloyId12.push(__alloyId14);
    var __alloyId16 = {
        type: "Ti.UI.Label",
        bindId: "subtitle",
        properties: {
            left: "10dp",
            right: "10dp",
            bottom: "10dp",
            font: {
                fontSize: "12dp",
                fontWeight: "normal"
            },
            height: "20dp",
            color: "#444",
            textAlign: "left",
            bindId: "subtitle"
        }
    };
    __alloyId12.push(__alloyId16);
    var __alloyId11 = {
        properties: {
            name: "titleAndSub",
            height: "70"
        },
        childTemplates: __alloyId12
    };
    __alloyId0["titleAndSub"] = __alloyId11;
    var __alloyId19 = [];
    var __alloyId21 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            left: "10dp",
            right: "10dp",
            top: "10dp",
            font: {
                fontSize: "18dp",
                fontWeight: "bold"
            },
            height: "30dp",
            color: "#222",
            textAlign: "left",
            bindId: "title"
        }
    };
    __alloyId19.push(__alloyId21);
    var __alloyId18 = {
        properties: {
            name: "title",
            height: "50"
        },
        childTemplates: __alloyId19
    };
    __alloyId0["title"] = __alloyId18;
    $.__views.section = Ti.UI.createListSection({
        id: "section"
    });
    var __alloyId26 = Alloy.Collections["info"] || info;
    __alloyId26.on("fetch destroy change add remove reset", __alloyId27);
    var __alloyId28 = [];
    __alloyId28.push($.__views.section);
    $.__views.list = Ti.UI.createListView({
        top: 0,
        bottom: "50dp",
        sections: __alloyId28,
        templates: __alloyId0,
        id: "list",
        defaultItemTemplate: "title"
    });
    $.__views.index.add($.__views.list);
    $.__views.toolbar = Ti.UI.createView({
        height: "50dp",
        width: "100%",
        bottom: 0,
        layout: "horizontal",
        id: "toolbar"
    });
    $.__views.index.add($.__views.toolbar);
    $.__views.__alloyId29 = Alloy.createController("button", {
        label: "reset",
        id: "__alloyId29",
        __parentSymbol: $.__views.toolbar
    });
    $.__views.__alloyId29.setParent($.__views.toolbar);
    doButtonClick ? $.__views.__alloyId29.on("buttonClick", doButtonClick) : __defers["$.__views.__alloyId29!buttonClick!doButtonClick"] = true;
    $.__views.__alloyId30 = Alloy.createController("button", {
        label: "template1",
        id: "__alloyId30",
        __parentSymbol: $.__views.toolbar
    });
    $.__views.__alloyId30.setParent($.__views.toolbar);
    doButtonClick ? $.__views.__alloyId30.on("buttonClick", doButtonClick) : __defers["$.__views.__alloyId30!buttonClick!doButtonClick"] = true;
    $.__views.__alloyId31 = Alloy.createController("button", {
        label: "template2",
        id: "__alloyId31",
        __parentSymbol: $.__views.toolbar
    });
    $.__views.__alloyId31.setParent($.__views.toolbar);
    doButtonClick ? $.__views.__alloyId31.on("buttonClick", doButtonClick) : __defers["$.__views.__alloyId31!buttonClick!doButtonClick"] = true;
    $.__views.__alloyId32 = Alloy.createController("button", {
        label: "template3",
        id: "__alloyId32",
        __parentSymbol: $.__views.toolbar
    });
    $.__views.__alloyId32.setParent($.__views.toolbar);
    doButtonClick ? $.__views.__alloyId32.on("buttonClick", doButtonClick) : __defers["$.__views.__alloyId32!buttonClick!doButtonClick"] = true;
    exports.destroy = function() {
        __alloyId26.off("fetch destroy change add remove reset", __alloyId27);
    };
    _.extend($, $.__views);
    var info = Alloy.Collections.info;
    $.index.open();
    info.fetch();
    __defers["$.__views.__alloyId29!buttonClick!doButtonClick"] && $.__views.__alloyId29.on("buttonClick", doButtonClick);
    __defers["$.__views.__alloyId30!buttonClick!doButtonClick"] && $.__views.__alloyId30.on("buttonClick", doButtonClick);
    __defers["$.__views.__alloyId31!buttonClick!doButtonClick"] && $.__views.__alloyId31.on("buttonClick", doButtonClick);
    __defers["$.__views.__alloyId32!buttonClick!doButtonClick"] && $.__views.__alloyId32.on("buttonClick", doButtonClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;