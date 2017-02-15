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
        var opts = __alloyId13.opts || {};
        var models = __alloyId12.models;
        var len = models.length;
        var __alloyId8 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId9 = models[i];
            __alloyId9.__transform = _.isFunction(__alloyId9.transform) ? __alloyId9.transform() : __alloyId9.toJSON();
            var __alloyId11 = {
                properties: {
                    title: __alloyId9.__transform.id + " - " + __alloyId9.__transform.title
                }
            };
            __alloyId8.push(__alloyId11);
        }
        opts.animation ? $.__views.__alloyId7.setItems(__alloyId8, opts.animation) : $.__views.__alloyId7.setItems(__alloyId8);
    }
    function createModel() {
        Alloy.Collections.mymodel.create({
            title: "crt TITLE"
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Models.instance("mymodel");
    Alloy.Collections.instance("mymodel");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        top: 30,
        id: "__alloyId4"
    });
    $.__views.index.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createButton({
        title: "Create Model Should Not Error",
        id: "__alloyId5"
    });
    $.__views.index.add($.__views.__alloyId5);
    createModel ? $.addListener($.__views.__alloyId5, "click", createModel) : __defers["$.__views.__alloyId5!click!createModel"] = true;
    $.__views.__alloyId7 = Ti.UI.createListSection({
        id: "__alloyId7"
    });
    var __alloyId12 = Alloy.Collections["mymodel"] || mymodel;
    __alloyId12.on("fetch destroy change add remove reset", __alloyId13);
    var __alloyId14 = [];
    __alloyId14.push($.__views.__alloyId7);
    $.__views.__alloyId6 = Ti.UI.createListView({
        sections: __alloyId14,
        id: "__alloyId6"
    });
    $.__views.index.add($.__views.__alloyId6);
    var __alloyId15 = function() {
        Alloy["Models"]["mymodel"].__transform = _.isFunction(Alloy["Models"]["mymodel"].transform) ? Alloy["Models"]["mymodel"].transform() : Alloy["Models"]["mymodel"].toJSON();
        $.__alloyId4.text = Alloy["Models"]["mymodel"]["__transform"]["id"] + " - " + Alloy["Models"]["mymodel"]["__transform"]["title"];
    };
    Alloy["Models"]["mymodel"].on("fetch change destroy", __alloyId15);
    exports.destroy = function() {
        __alloyId12 && __alloyId12.off("fetch destroy change add remove reset", __alloyId13);
        Alloy["Models"]["mymodel"] && Alloy["Models"]["mymodel"].off("fetch change destroy", __alloyId15);
    };
    _.extend($, $.__views);
    Alloy.Models.mymodel.set({
        id: 0,
        title: "mod TITLE"
    });
    Alloy.Collections.mymodel.reset([ {
        id: 0,
        title: "col TITLE"
    } ]);
    $.index.open();
    $.createModel = createModel;
    require("specs/index")($);
    __defers["$.__views.__alloyId5!click!createModel"] && $.addListener($.__views.__alloyId5, "click", createModel);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;