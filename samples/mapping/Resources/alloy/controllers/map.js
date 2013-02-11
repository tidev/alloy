function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {}, __alloyId1 = [];
    $.__views.__alloyId2 = Alloy.createController("annotation", {
        title: "Appcelerator",
        id: "__alloyId2"
    });
    __alloyId1.push($.__views.__alloyId2.getViewEx({
        recurse: !0
    }));
    $.__views.map = A$(Ti.Map.createView({
        top: "50dp",
        animate: !0,
        regionFit: !0,
        userLocation: !1,
        region: {
            latitude: Alloy.Globals.LATITUDE_BASE,
            longitude: Alloy.Globals.LONGITUDE_BASE,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        },
        annotations: __alloyId1,
        ns: "Ti.Map",
        id: "map",
        mapType: "Ti.Map.STANDARD_TYPE"
    }), "View", null);
    $.addTopLevelView($.__views.map);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.map.addEventListener("click", function(e) {
        e.annotation && (e.clicksource === "leftButton" || e.clicksource == "leftPane") && $.map.removeAnnotation(e.annotation);
    });
    exports.addAnnotation = function(geodata) {
        var annotation = Alloy.createController("annotation", {
            title: geodata.title,
            latitude: geodata.coords.latitude,
            longitude: geodata.coords.longitude
        });
        $.map.addAnnotation(annotation.getView());
        $.map.setLocation({
            latitude: geodata.coords.latitude,
            longitude: geodata.coords.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1
        });
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;