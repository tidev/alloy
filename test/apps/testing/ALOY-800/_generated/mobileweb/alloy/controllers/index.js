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
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
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
    var __alloyId0 = [];
    $.__views.__alloyId1 = Ti.Map.createAnnotation({
        latitude: 37.389569,
        longitude: -122.050212,
        title: "XML Annotation",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.annotation2 = Ti.Map.createAnnotation({
        title: "TSS Annotation",
        latitude: 37.392,
        longitude: -122.061,
        id: "annotation2"
    });
    __alloyId0.push($.__views.annotation2);
    $.__views.map = (require("ti.map").createView || Ti.UI.createView)({
        userLocation: false,
        mapType: Alloy.Globals.Map.SATELLITE_TYPE,
        animate: true,
        region: {
            latitude: 37.38,
            latitudeDelta: .2,
            longitude: -122.05,
            longitudeDelta: .2
        },
        annotations: __alloyId0,
        id: "map"
    });
    $.__views.index.add($.__views.map);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;