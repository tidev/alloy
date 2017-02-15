function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId8(e) {
        if (e && e.fromAdapter) return;
        __alloyId8.opts || {};
        var models = __alloyId7.models;
        var len = models.length;
        var rows = [];
        _.each($.__views.column1.getRows(), function(r) {
            $.__views.column1.removeRow(r);
        });
        for (var i = 0; len > i; i++) {
            var __alloyId5 = models[i];
            __alloyId5.__transform = _.isFunction(__alloyId5.transform) ? __alloyId5.transform() : __alloyId5.toJSON();
            $.__views.__alloyId6 = Ti.UI.createPickerRow({
                title: __alloyId5.__transform.name,
                id: "__alloyId6"
            });
            rows.push($.__views.__alloyId6);
        }
        _.each(rows, function(row) {
            $.__views.column1.addRow(row);
        });
    }
    function __alloyId12(e) {
        if (e && e.fromAdapter) return;
        __alloyId12.opts || {};
        var models = __alloyId11.models;
        var len = models.length;
        var rows = [];
        _.each($.__views.column2.getRows(), function(r) {
            $.__views.column2.removeRow(r);
        });
        for (var i = 0; len > i; i++) {
            var __alloyId9 = models[i];
            __alloyId9.__transform = doTransform(__alloyId9);
            $.__views.__alloyId10 = Ti.UI.createPickerRow({
                title: __alloyId9.__transform.color,
                id: "__alloyId10"
            });
            rows.push($.__views.__alloyId10);
        }
        _.each(rows, function(row) {
            $.__views.column2.addRow(row);
        });
    }
    function doTransform(model) {
        var transform = model.toJSON();
        transform.color = transform.color.toUpperCase();
        return transform;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    Alloy.Collections.instance("fruits");
    Alloy.Collections.instance("colors");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.picker = Ti.UI.createPicker({
        id: "picker",
        top: 50,
        useSpinner: true
    });
    $.__views.index.add($.__views.picker);
    var __alloyId4 = [];
    $.__views.column1 = Ti.UI.createPickerColumn({
        id: "column1"
    });
    __alloyId4.push($.__views.column1);
    var __alloyId7 = Alloy.Collections["fruits"] || fruits;
    __alloyId7.on("fetch destroy change add remove reset", __alloyId8);
    $.__views.column2 = Ti.UI.createPickerColumn({
        id: "column2"
    });
    __alloyId4.push($.__views.column2);
    var __alloyId11 = Alloy.Collections["colors"] || colors;
    __alloyId11.on("fetch destroy change add remove reset", __alloyId12);
    $.__views.picker.add(__alloyId4);
    exports.destroy = function() {
        __alloyId7 && __alloyId7.off("fetch destroy change add remove reset", __alloyId8);
        __alloyId11 && __alloyId11.off("fetch destroy change add remove reset", __alloyId12);
    };
    _.extend($, $.__views);
    var fruits = [ "apple", "banana", "cherry", "blueberry", "orange", "pear" ];
    var colors = [ "red", "yellow", "blue", "orange", "green", "white" ];
    for (var i = 1, j = fruits.length; j > i; i++) {
        Alloy.createModel("fruits", {
            name: fruits[i]
        }).save();
        Alloy.createModel("colors", {
            color: colors[i]
        }).save();
    }
    Alloy.Collections.fruits.fetch();
    Alloy.Collections.colors.fetch();
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;