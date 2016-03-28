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
        __alloyId6.opts || {};
        var models = __alloyId5.models;
        var len = models.length;
        for (var i = 0; len > i; i++) {
            var __alloyId4 = models[i];
            __alloyId2.push(require("ti.map").createAnnotation(_.isFunction(__alloyId4.transform) ? __alloyId4.transform() : __alloyId4.toJSON()));
        }
        $.__views.map.annotations = __alloyId2;
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
    Alloy.Collections.instance("pins");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId2 = [];
    $.__views.__alloyId3 = require("ti.map").createAnnotation({
        latitude: 37.39,
        longitude: -122.051,
        title: "XML Annotation",
        id: "__alloyId3"
    });
    __alloyId2.push($.__views.__alloyId3);
    $.__views.map = (require("ti.map").createView || Ti.UI.createView)({
        userLocation: false,
        animate: true,
        region: {
            latitude: 37.3892876,
            latitudeDelta: .015,
            longitude: -122.0502364,
            longitudeDelta: .015
        },
        annotations: __alloyId2,
        id: "map"
    });
    $.__views.index.add($.__views.map);
    var __alloyId5 = Alloy.Collections["pins"] || pins;
    __alloyId5.on("fetch destroy change add remove reset", __alloyId6);
    exports.destroy = function() {
        __alloyId5 && __alloyId5.off("fetch destroy change add remove reset", __alloyId6);
    };
    _.extend($, $.__views);
    if (!Ti.App.Properties.hasProperty("seeded")) {
        var pins = [ {
            title: "Appcelerator",
            latitude: 37.3892876,
            longitude: -122.0502364
        }, {
            title: "SETI Institute",
            latitude: 37.386697,
            longitude: -122.052028
        }, {
            title: "Someplace nearby",
            latitude: 37.3880608,
            longitude: -122.0559039
        } ];
        for (var i = 0, j = pins.length; j > i; i++) Alloy.createModel("pins", {
            title: pins[i].title,
            latitude: pins[i].latitude,
            longitude: pins[i].longitude
        }).save();
        Ti.App.Properties.setString("seeded", "yuppers");
    }
    Alloy.Collections.pins.fetch();
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;