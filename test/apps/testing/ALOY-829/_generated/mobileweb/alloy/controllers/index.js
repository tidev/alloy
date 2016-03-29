function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId6(e) {
        if (e && e.fromAdapter) return;
        var opts = __alloyId6.opts || {};
        var models = __alloyId5.models;
        var len = models.length;
        var __alloyId1 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId2 = models[i];
            __alloyId2.__transform = _.isFunction(__alloyId2.transform) ? __alloyId2.transform() : __alloyId2.toJSON();
            var __alloyId4 = {
                properties: {
                    title: _.template('{m["name"]}', {
                        m: __alloyId2.__transform
                    }, {
                        interpolate: /\{([\s\S]+?)\}/g
                    }),
                    modelId: _.template('{m["id"]}', {
                        m: __alloyId2.__transform
                    }, {
                        interpolate: /\{([\s\S]+?)\}/g
                    })
                }
            };
            __alloyId1.push(__alloyId4);
        }
        opts.animation ? $.__views.section.setItems(__alloyId1, opts.animation) : $.__views.section.setItems(__alloyId1);
    }
    function green(str) {
        return "[32m" + str + "[39m";
    }
    function red(str) {
        return "[31m" + str + "[39m";
    }
    function showInfo(e) {
        var modelId = e.section.getItemAt(e.itemIndex).properties.modelId;
        var model = Alloy.createModel("info");
        model.fetch({
            id: modelId
        });
        var pass = JSON.stringify(model.attributes) === JSON.stringify({
            id: modelId,
            info: "info " + modelId
        });
        Ti.API.info('Assert single info model returned with "{id:' + modelId + '}": ' + (pass ? green("OK") : red("FAIL")));
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
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.section = Ti.UI.createListSection({
        id: "section"
    });
    var __alloyId5 = Alloy.Collections["name"] || name;
    __alloyId5.on("fetch destroy change add remove reset", __alloyId6);
    var __alloyId7 = [];
    __alloyId7.push($.__views.section);
    $.__views.__alloyId0 = Ti.UI.createListView({
        sections: __alloyId7,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    showInfo ? $.addListener($.__views.__alloyId0, "itemclick", showInfo) : __defers["$.__views.__alloyId0!itemclick!showInfo"] = true;
    exports.destroy = function() {
        __alloyId5 && __alloyId5.off("fetch destroy change add remove reset", __alloyId6);
    };
    _.extend($, $.__views);
    var names = Alloy.Collections.name;
    names.fetch();
    $.index.open();
    __defers["$.__views.__alloyId0!itemclick!showInfo"] && $.addListener($.__views.__alloyId0, "itemclick", showInfo);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;