function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.annotation = A$(Ti.Map.createAnnotation({
        animate: !0,
        pincolor: Titanium.Map.ANNOTATION_RED,
        leftButton: "/images/delete.png",
        id: "annotation"
    }), "Annotation", null);
    $.addTopLevelView($.__views.annotation);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.annotation.title = args.title || "";
    $.annotation.latitude = args.latitude || Alloy.Globals.LATITUDE_BASE;
    $.annotation.longitude = args.longitude || Alloy.Globals.LONGITUDE_BASE;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;