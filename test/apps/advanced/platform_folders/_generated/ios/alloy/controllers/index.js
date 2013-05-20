function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#000",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.coverflow = Ti.UI.iOS.createCoverFlowView({
        backgroundColor: "#000",
        images: [ "/appc1.png", "/appc2.png", "/appc3.png", "/appc4.png" ],
        id: "coverflow"
    });
    $.__views.index.add($.__views.coverflow);
    $.__views.apilabel = Ti.UI.createLabel({
        color: "#fff",
        textAlign: "center",
        font: {
            fontSize: 20,
            fontWeight: "bold"
        },
        bottom: 10,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        text: "Ti.UI.iOS.CoverFlowView",
        id: "apilabel"
    });
    $.__views.index.add($.__views.apilabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;