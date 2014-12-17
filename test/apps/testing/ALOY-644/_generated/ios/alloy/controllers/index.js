function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId11(e) {
        if (e && e.fromAdapter) return;
        __alloyId11.opts || {};
        var models = __alloyId10.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId7 = models[i];
            __alloyId7.__transform = {};
            var __alloyId9 = Ti.UI.createTableViewRow({
                title: "undefined" != typeof __alloyId7.__transform["name"] ? __alloyId7.__transform["name"] : __alloyId7.get("name")
            });
            rows.push(__alloyId9);
        }
        $.__views.table.setData(rows);
    }
    function generateRandomColor() {
        var c = 256 * Math.floor(255 * Math.random()) * 256 + 256 * Math.floor(255 * Math.random()) + Math.floor(255 * Math.random());
        c = c.toString(16);
        while (c.length < 6) c = "0" + c;
        return "#" + c;
    }
    function modifyHero(e) {
        var model = heroes.at(e.index);
        model.set("name", model.get("name") + "+");
        model.save();
    }
    function updateState() {
        appState.set({
            counter: appState.get("counter") + 1,
            color: generateRandomColor()
        });
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
    var __defers = {};
    var __alloyId0 = [];
    $.__views.__alloyId2 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        navBarHidden: true,
        id: "__alloyId2"
    });
    $.__views.__alloyId3 = Ti.UI.createLabel({
        height: "50dp",
        width: Ti.UI.FILL,
        top: 0,
        textAlign: "center",
        color: "#fff",
        font: {
            fontSize: "32dp",
            fontWeight: "bold"
        },
        text: "Model",
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.counter = Ti.UI.createLabel({
        font: {
            fontSize: "160dp",
            fontWeight: "bold"
        },
        id: "counter"
    });
    $.__views.__alloyId2.add($.__views.counter);
    updateState ? $.__views.counter.addEventListener("click", updateState) : __defers["$.__views.counter!click!updateState"] = true;
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "model",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId5 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        navBarHidden: true,
        id: "__alloyId5"
    });
    $.__views.__alloyId6 = Ti.UI.createLabel({
        height: "50dp",
        width: Ti.UI.FILL,
        top: 0,
        textAlign: "center",
        color: "#fff",
        font: {
            fontSize: "32dp",
            fontWeight: "bold"
        },
        text: "Collection",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.table = Ti.UI.createTableView({
        top: "50dp",
        id: "table"
    });
    $.__views.__alloyId5.add($.__views.table);
    var __alloyId10 = Alloy.Collections["heroes"] || heroes;
    __alloyId10.on("fetch destroy change add remove reset", __alloyId11);
    modifyHero ? $.__views.table.addEventListener("click", modifyHero) : __defers["$.__views.table!click!modifyHero"] = true;
    $.__views.__alloyId4 = Ti.UI.createTab({
        window: $.__views.__alloyId5,
        title: "collection",
        id: "__alloyId4"
    });
    __alloyId0.push($.__views.__alloyId4);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId12 = function() {
        $.__alloyId3.backgroundColor = _.isFunction(Alloy.Models.appState.transform) ? Alloy.Models.appState.transform()["color"] : _.template("<%=appState.color%>", {
            appState: Alloy.Models.appState.toJSON()
        });
        $.counter.text = _.isFunction(Alloy.Models.appState.transform) ? Alloy.Models.appState.transform()["counter"] : _.template("<%=appState.counter%>", {
            appState: Alloy.Models.appState.toJSON()
        });
        $.counter.color = _.isFunction(Alloy.Models.appState.transform) ? Alloy.Models.appState.transform()["color"] : _.template("<%=appState.color%>", {
            appState: Alloy.Models.appState.toJSON()
        });
        $.__alloyId6.backgroundColor = _.isFunction(Alloy.Models.appState.transform) ? Alloy.Models.appState.transform()["color"] : _.template("<%=appState.color%>", {
            appState: Alloy.Models.appState.toJSON()
        });
    };
    Alloy.Models.appState.on("fetch change destroy", __alloyId12);
    exports.destroy = function() {
        __alloyId10.off("fetch destroy change add remove reset", __alloyId11);
        Alloy.Models.appState.off("fetch change destroy", __alloyId12);
    };
    _.extend($, $.__views);
    var appState = Alloy.Models.appState;
    var heroes = Alloy.Collections.heroes;
    appState.trigger("change");
    heroes.trigger("change");
    appState.fetch();
    $.index.open();
    __defers["$.__views.counter!click!updateState"] && $.__views.counter.addEventListener("click", updateState);
    __defers["$.__views.table!click!modifyHero"] && $.__views.table.addEventListener("click", modifyHero);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;