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
    $.__views.addAddress = Alloy.createController("addAddress", {
        id: "addAddress"
    });
    $.__views.addAddress.setParent($.__views.index);
    $.__views.map = Alloy.createController("map", {
        id: "map"
    });
    $.__views.map.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.addAddress.on("addAnnotation", function(e) {
        $.map.addAnnotation(e.geodata);
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;