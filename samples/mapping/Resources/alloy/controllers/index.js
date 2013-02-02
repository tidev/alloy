function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = A$(Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: !1,
        exitOnClose: !0,
        id: "index"
    }), "Window", null);
    $.addTopLevelView($.__views.index);
    $.__views.__alloyId1 = A$(Ti.UI.createView({
        backgroundColor: "#800",
        height: "50dp",
        top: 0,
        id: "__alloyId1"
    }), "View", $.__views.index);
    $.__views.index.add($.__views.__alloyId1);
    $.__views.textField = A$(Ti.UI.createTextField({
        height: "40dp",
        top: "5dp",
        left: "5dp",
        right: "50dp",
        style: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundColor: "#fff",
        paddingLeft: "5dp",
        id: "textField",
        hintText: "Enter an address"
    }), "TextField", $.__views.__alloyId1);
    $.__views.__alloyId1.add($.__views.textField);
    $.__views.button = A$(Ti.UI.createButton({
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        top: "5dp",
        height: "40dp",
        width: "40dp",
        right: "5dp",
        id: "button",
        title: "+"
    }), "Button", $.__views.__alloyId1);
    $.__views.__alloyId1.add($.__views.button);
    var __alloyId2 = [];
    $.__views.__alloyId3 = Alloy.createController("annotation", {
        title: "Appcelerator",
        id: "__alloyId3"
    });
    __alloyId2.push($.__views.__alloyId3.getViewEx({
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
        annotations: __alloyId2,
        ns: "Ti.Map",
        id: "map",
        mapType: "Ti.Map.STANDARD_TYPE"
    }), "View", $.__views.index);
    $.__views.index.add($.__views.map);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var geo = require("geo");
    $.map.addEventListener("click", function(e) {
        e.annotation && (e.clicksource === "leftButton" || e.clicksource == "leftPane") && $.map.removeAnnotation(e.annotation);
    });
    $.button.addEventListener("click", function(e) {
        $.textField.blur();
        geo.forwardGeocode($.textField.value, function(geodata) {
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
        });
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;