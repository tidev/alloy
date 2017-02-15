function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function renderTablet(e) {
        if (e && e.fromAdapter) return;
        renderTablet.opts || {};
        var models = __alloyId8.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId3 = models[i];
            __alloyId3.__transform = _.isFunction(__alloyId3.transform) ? __alloyId3.transform() : __alloyId3.toJSON();
            var __alloyId5 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId5);
            var __alloyId7 = Ti.UI.createLabel({
                left: 5,
                text: __alloyId3.__transform.username,
                color: "red"
            });
            __alloyId5.add(__alloyId7);
        }
        $.__views.__alloyId2.setData(rows);
    }
    function renderHandheld(e) {
        if (e && e.fromAdapter) return;
        renderHandheld.opts || {};
        var models = __alloyId15.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId10 = models[i];
            __alloyId10.__transform = _.isFunction(__alloyId10.transform) ? __alloyId10.transform() : __alloyId10.toJSON();
            var __alloyId12 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId12);
            var __alloyId14 = Ti.UI.createLabel({
                left: 5,
                text: __alloyId10.__transform.username,
                color: "blue"
            });
            __alloyId12.add(__alloyId14);
        }
        $.__views.__alloyId9.setData(rows);
    }
    function render() {
        Alloy.isTablet && renderTablet();
        Alloy.isHandheld && renderHandheld();
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
    Alloy.Collections.instance("test");
    if (Alloy.isTablet) {
        $.__views.index = Ti.UI.createWindow({
            backgroundColor: "#fff",
            fullscreen: false,
            exitOnClose: true,
            id: "index"
        });
        $.__views.index && $.addTopLevelView($.__views.index);
        $.__views.__alloyId2 = Ti.UI.createTableView({
            top: 20,
            id: "__alloyId2"
        });
        $.__views.index.add($.__views.__alloyId2);
        var __alloyId8 = Alloy.Collections["test"] || test;
        __alloyId8.on("fetch destroy change add remove reset", renderTablet);
    }
    if (!Alloy.isTablet) {
        $.__views.index = Ti.UI.createWindow({
            backgroundColor: "#fff",
            fullscreen: false,
            exitOnClose: true,
            id: "index"
        });
        $.__views.index && $.addTopLevelView($.__views.index);
        $.__views.__alloyId9 = Ti.UI.createTableView({
            top: 20,
            id: "__alloyId9"
        });
        $.__views.index.add($.__views.__alloyId9);
        var __alloyId15 = Alloy.Collections["test"] || test;
        __alloyId15.on("fetch destroy change add remove reset", renderHandheld);
    }
    exports.destroy = function() {
        __alloyId8 && Alloy.isTablet && __alloyId8.off("fetch destroy change add remove reset", renderTablet);
        __alloyId15 && Alloy.isHandheld && __alloyId15.off("fetch destroy change add remove reset", renderHandheld);
    };
    _.extend($, $.__views);
    Ti.API.info("aloy1127: " + Ti.App.Properties.hasProperty("aloy1127"));
    if (!Ti.App.Properties.hasProperty("aloy1127")) {
        for (var i = 1, j = 7; j > i; i++) Alloy.createModel("test", {
            username: "User " + i
        }).save();
        Ti.App.Properties.setString("aloy1127", "yes");
    }
    Alloy.Collections.test.fetch();
    $.index.addEventListener("open", function() {
        $.destroy();
    });
    $.index.open();
    render();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;