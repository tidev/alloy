function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.txt = Ti.UI.createTextField({
        value: "July 4, 2014",
        id: "txt",
        top: "20"
    });
    $.__views.index.add($.__views.txt);
    $.__views.picker = Ti.UI.createPicker({
        value: new Date("Wed Dec 17 2014 03:24:00 GMT-0500 (EST)"),
        minDate: new Date("Fri Feb 08 2013 04:30:26 GMT-0500 (EST)"),
        maxDate: new Date("Tue Nov 17 2015 00:00:00 GMT-0500 (EST)"),
        format24: false,
        calendarViewShown: false,
        id: "picker",
        top: "50",
        type: Ti.UI.PICKER_TYPE_DATE
    });
    $.__views.index.add($.__views.picker);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;