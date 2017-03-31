function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId5() {
        $.__views.index.removeEventListener("open", __alloyId5);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            var __alloyId4 = {
                title: "Add",
                showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
                id: "__alloyId3"
            };
            $.__views.__alloyId3 = e.menu.add(_.pick(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId3.applyProperties(_.omit(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.__alloyId3 = $.__views.__alloyId3;
            doClick ? $.addListener($.__views.__alloyId3, "click", doClick) : __defers["$.__views.__alloyId3!click!doClick"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function __alloyId12(e) {
        if (e && e.fromAdapter) return;
        __alloyId12.opts || {};
        var models = __alloyId11.models;
        var len = models.length;
        var rows = [];
        _.each($.__views.__alloyId8.getRows(), function(r) {
            $.__views.__alloyId8.removeRow(r);
        });
        for (var i = 0; len > i; i++) {
            var __alloyId9 = models[i];
            __alloyId9.__transform = _.isFunction(__alloyId9.transform) ? __alloyId9.transform() : __alloyId9.toJSON();
            $.__views.__alloyId10 = Ti.UI.createPickerRow({
                fontSize: "18dp",
                title: __alloyId9.__transform.title,
                id: "__alloyId10"
            });
            rows.push($.__views.__alloyId10);
        }
        _.each(rows, function(row) {
            $.__views.__alloyId8.addRow(row);
        });
    }
    function __alloyId18(e) {
        if (e && e.fromAdapter) return;
        __alloyId18.opts || {};
        var models = __alloyId17.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId14 = models[i];
            __alloyId14.__transform = _.isFunction(__alloyId14.transform) ? __alloyId14.transform() : __alloyId14.toJSON();
            var __alloyId16 = Ti.UI.createTableViewRow({
                color: "black",
                font: {
                    fontSize: "18dp"
                },
                title: __alloyId14.__transform.title
            });
            rows.push(__alloyId16);
        }
        $.__views.__alloyId13.setData(rows);
    }
    function doClick(e) {
        Ti.API.info(JSON.stringify(e));
        var item = Alloy.createModel("book", {
            title: i
        });
        Alloy.Collections.book.add(item);
        i++;
    }
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Collections.instance("book");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.index.addEventListener("open", __alloyId5);
    $.__views.__alloyId6 = Ti.UI.createPicker({
        backgroundColor: "black",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        selectionIndicator: true,
        top: 0,
        id: "__alloyId6"
    });
    $.__views.index.add($.__views.__alloyId6);
    var __alloyId7 = [];
    $.__views.__alloyId8 = Ti.UI.createPickerColumn({
        id: "__alloyId8"
    });
    __alloyId7.push($.__views.__alloyId8);
    var __alloyId11 = Alloy.Collections["book"] || book;
    __alloyId11.on("fetch destroy change add remove reset", __alloyId12);
    $.__views.__alloyId6.add(__alloyId7);
    $.__views.__alloyId13 = Ti.UI.createTableView({
        top: 100,
        id: "__alloyId13"
    });
    $.__views.index.add($.__views.__alloyId13);
    var __alloyId17 = Alloy.Collections["book"] || book;
    __alloyId17.on("fetch destroy change add remove reset", __alloyId18);
    $.__views.__alloyId19 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "15dp"
        },
        text: "Click the ActionBar icon to add a row",
        id: "__alloyId19"
    });
    $.__views.index.add($.__views.__alloyId19);
    exports.destroy = function() {
        __alloyId11 && __alloyId11.off("fetch destroy change add remove reset", __alloyId12);
        __alloyId17 && __alloyId17.off("fetch destroy change add remove reset", __alloyId18);
    };
    _.extend($, $.__views);
    Alloy.Collections.book.fetch();
    var i = 0;
    $.index.open();
    __defers["$.__views.__alloyId3!click!doClick"] && $.addListener($.__views.__alloyId3, "click", doClick);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;