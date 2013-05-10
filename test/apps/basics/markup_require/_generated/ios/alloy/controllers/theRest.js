function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.middle = Alloy.createController("middle", {
        id: "middle"
    });
    $.__views.middle && $.addTopLevelView($.__views.middle);
    $.__views.bottom = Alloy.createController("bottom", {
        id: "bottom"
    });
    $.__views.bottom && $.addTopLevelView($.__views.bottom);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.bottom.getView("b").addEventListener("click", function() {
        $.middle.getView("t").text = "You clicked me";
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;