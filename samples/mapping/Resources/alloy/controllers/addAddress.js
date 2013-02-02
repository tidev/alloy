function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.addAddress = A$(Ti.UI.createView({
        backgroundColor: "#800",
        height: "50dp",
        top: 0,
        id: "addAddress"
    }), "View", null);
    $.addTopLevelView($.__views.addAddress);
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
    }), "TextField", $.__views.addAddress);
    $.__views.addAddress.add($.__views.textField);
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
    }), "Button", $.__views.addAddress);
    $.__views.addAddress.add($.__views.button);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var geo = require("geo"), self = this;
    $.button.addEventListener("click", function(e) {
        $.textField.blur();
        geo.forwardGeocode($.textField.value, function(geodata) {
            self.trigger("addAnnotation", {
                geodata: geodata
            });
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;