function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId9(e) {
        if (e && e.fromAdapter) return;
        __alloyId9.opts || {};
        var models = __alloyId8.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId1 = models[i];
            __alloyId1.__transform = _.isFunction(__alloyId1.transform) ? __alloyId1.transform() : __alloyId1.toJSON();
            var __alloyId3 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId3);
            var __alloyId5 = Ti.UI.createView({
                backgroundColor: "#efefef",
                height: "60dp"
            });
            __alloyId3.add(__alloyId5);
            test ? $.addListener(__alloyId5, "click", test) : __defers["__alloyId5!click!test"] = true;
            var __alloyId7 = Ti.UI.createLabel({
                left: "100dp",
                right: "10dp",
                height: Ti.UI.SIZE,
                textAlign: "left",
                color: "#181818",
                font: {
                    fontSize: "32dp",
                    fontWeight: "bold"
                },
                touchEnabled: false,
                text: "Location"
            });
            __alloyId5.add(__alloyId7);
        }
        $.__views.__alloyId0.setData(rows);
    }
    function test() {
        Ti.API.info("test");
    }
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
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#efefef",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createTableView({
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    var __alloyId8 = Alloy.Collections["data"] || data;
    __alloyId8.on("fetch destroy change add remove reset", __alloyId9);
    exports.destroy = function() {
        __alloyId8 && __alloyId8.off("fetch destroy change add remove reset", __alloyId9);
    };
    _.extend($, $.__views);
    Alloy.Collections.data.trigger("change");
    $.index.open();
    __defers["__alloyId5!click!test"] && $.addListener(__alloyId5, "click", test);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;