function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId11(e) {
        if (e && e.fromAdapter) return;
        __alloyId11.opts || {};
        var models = __alloyId10.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId1 = models[i];
            __alloyId1.__transform = doUpper(__alloyId1);
            var __alloyId3 = Ti.UI.createTableViewRow({
                backgroundColor: "#efefef",
                height: "60dp"
            });
            rows.push(__alloyId3);
            var __alloyId5 = Ti.UI.createLabel({
                right: "68dp",
                textAlign: "left",
                height: Ti.UI.SIZE,
                top: "3dp",
                left: "10dp",
                color: "#181818",
                font: {
                    fontSize: "28dp",
                    fontWeight: "bold"
                },
                text: _.template('	{m["	title	"]}', {
                    m: __alloyId1.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            });
            __alloyId3.add(__alloyId5);
            var __alloyId7 = Ti.UI.createLabel({
                right: "68dp",
                textAlign: "left",
                height: Ti.UI.SIZE,
                bottom: "5dp",
                left: "15dp",
                color: "#777",
                font: {
                    fontSize: "16dp",
                    fontWeight: "normal"
                },
                text: _.template('		  {m["subtitle"]}', {
                    m: __alloyId1.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            });
            __alloyId3.add(__alloyId7);
            var __alloyId9 = Ti.UI.createImageView({
                right: "10dp",
                height: "48dp",
                width: "48dp",
                image: _.template('{m[" image "]}', {
                    m: __alloyId1.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            });
            __alloyId3.add(__alloyId9);
        }
        $.__views.__alloyId0.setData(rows);
    }
    function doUpper(model) {
        var transform = model.toJSON();
        transform.title = transform.title.toUpperCase();
        Ti.API.info(">>> transforming the title");
        return transform;
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
    var __alloyId10 = Alloy.Collections["collection"] || collection;
    __alloyId10.on("fetch destroy change add remove reset", __alloyId11);
    exports.destroy = function() {
        __alloyId10 && __alloyId10.off("fetch destroy change add remove reset", __alloyId11);
    };
    _.extend($, $.__views);
    Alloy.Collections.collection.trigger("change");
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;