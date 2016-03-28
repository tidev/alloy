function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId3() {
        $.__views.index.removeEventListener("open", __alloyId3);
        if ($.__views.index.activity) $.__views.index.activity.actionBar.onHomeIconItemSelected = doClick; else {
            Ti.API.warn("You attempted to access an Activity on a lightweight Window or other");
            Ti.API.warn("UI component which does not have an Android activity. Android Activities");
            Ti.API.warn("are valid with only windows in TabGroups or heavyweight Windows.");
        }
    }
    function __alloyId10(e) {
        if (e && e.fromAdapter) return;
        __alloyId10.opts || {};
        var models = __alloyId9.models;
        var len = models.length;
        var rows = [];
        _.each($.__views.__alloyId6.getRows(), function(r) {
            $.__views.__alloyId6.removeRow(r);
        });
        for (var i = 0; len > i; i++) {
            var __alloyId7 = models[i];
            __alloyId7.__transform = _.isFunction(__alloyId7.transform) ? __alloyId7.transform() : __alloyId7.toJSON();
            $.__views.__alloyId8 = Ti.UI.createPickerRow({
                fontSize: "18dp",
                title: _.template("{title}", __alloyId7.__transform, {
                    interpolate: /\{([\s\S]+?)\}/g
                }),
                id: "__alloyId8"
            });
            rows.push($.__views.__alloyId8);
        }
        _.each(rows, function(row) {
            $.__views.__alloyId6.addRow(row);
        });
    }
    function __alloyId16(e) {
        if (e && e.fromAdapter) return;
        __alloyId16.opts || {};
        var models = __alloyId15.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId12 = models[i];
            __alloyId12.__transform = _.isFunction(__alloyId12.transform) ? __alloyId12.transform() : __alloyId12.toJSON();
            var __alloyId14 = Ti.UI.createTableViewRow({
                color: "black",
                font: {
                    fontSize: "18dp"
                },
                title: _.template("{title}", __alloyId12.__transform, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            });
            rows.push(__alloyId14);
        }
        $.__views.__alloyId11.setData(rows);
    }
    function doClick(e) {
        Ti.API.info(JSON.stringify(e));
        var item = Alloy.createModel("book", {
            title: i
        });
        Alloy.Collections.book.add(item);
        i++;
    }
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
    Alloy.Collections.instance("book");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.index.addEventListener("open", __alloyId3);
    $.__views.__alloyId4 = Ti.UI.createPicker({
        backgroundColor: "black",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        selectionIndicator: true,
        top: 0,
        id: "__alloyId4"
    });
    $.__views.index.add($.__views.__alloyId4);
    var __alloyId5 = [];
    $.__views.__alloyId6 = Ti.UI.createPickerColumn({
        id: "__alloyId6"
    });
    __alloyId5.push($.__views.__alloyId6);
    var __alloyId9 = Alloy.Collections["book"] || book;
    __alloyId9.on("fetch destroy change add remove reset", __alloyId10);
    $.__views.__alloyId4.add(__alloyId5);
    $.__views.__alloyId11 = Ti.UI.createTableView({
        top: 100,
        id: "__alloyId11"
    });
    $.__views.index.add($.__views.__alloyId11);
    var __alloyId15 = Alloy.Collections["book"] || book;
    __alloyId15.on("fetch destroy change add remove reset", __alloyId16);
    $.__views.__alloyId17 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "15dp"
        },
        text: "Click the ActionBar icon to add a row",
        id: "__alloyId17"
    });
    $.__views.index.add($.__views.__alloyId17);
    exports.destroy = function() {
        __alloyId9 && __alloyId9.off("fetch destroy change add remove reset", __alloyId10);
        __alloyId15 && __alloyId15.off("fetch destroy change add remove reset", __alloyId16);
    };
    _.extend($, $.__views);
    Alloy.Collections.book.fetch();
    var i = 0;
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;