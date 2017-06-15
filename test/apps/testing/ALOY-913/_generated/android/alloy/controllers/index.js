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
        var models = whereFunction(__alloyId7);
        var len = models.length;
        var children = $.__views.todoTable.children;
        for (var d = children.length - 1; d >= 0; d--) $.__views.todoTable.remove(children[d]);
        for (var i = 0; len > i; i++) {
            var __alloyId3 = models[i];
            __alloyId3.__transform = transformFunction(__alloyId3);
            var __alloyId4 = Ti.UI.createView({
                height: "50dp",
                backgroundColor: "#fff",
                focusable: false
            });
            $.__views.todoTable.add(__alloyId4);
            var __alloyId5 = Ti.UI.createLabel({
                color: "#000",
                left: "50dp",
                right: "50dp",
                height: Ti.UI.SIZE,
                font: {
                    fontSize: "18dp"
                },
                text: __alloyId3.__transform.item
            });
            __alloyId4.add(__alloyId5);
            var __alloyId6 = Ti.UI.createTextField({
                right: 0,
                height: "50dp",
                width: "100dp",
                borderColor: "#ccc",
                borderWidth: 1,
                value: 1,
                text: "Quantity"
            });
            __alloyId4.add(__alloyId6);
            setQuantity ? $.addListener(__alloyId6, "focus", setQuantity) : __defers["__alloyId6!focus!setQuantity"] = true;
        }
    }
    function whereFunction(collection) {
        return whereIndex ? collection.where({
            done: 1 === whereIndex ? 0 : 1
        }) : collection.models;
    }
    function transformFunction(model) {
        var transform = model.toJSON();
        transform.item = "[" + transform.item + "]";
        return transform;
    }
    function addToDoItem() {
        Alloy.createController("add").getView().open();
    }
    function setQuantity(e) {
        alert("setQuantity");
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
    $.__views.todoWin = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        navBarHidden: true,
        exitOnClose: true,
        id: "todoWin",
        title: "Todo"
    });
    $.__views.todoWin && $.addTopLevelView($.__views.todoWin);
    $.__views.header = Ti.UI.createView({
        top: Alloy.Globals.top,
        height: "50dp",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#a00",
                offset: 0
            }, {
                color: "#800",
                offset: 1
            } ]
        },
        id: "header"
    });
    $.__views.todoWin.add($.__views.header);
    $.__views.title = Ti.UI.createLabel({
        color: "#fff",
        left: "10dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        text: "Alloy Todo",
        id: "title"
    });
    $.__views.header.add($.__views.title);
    $.__views.__alloyId2 = Ti.UI.createView({
        height: "48dp",
        width: "3dp",
        top: "1dp",
        right: "50dp",
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "100%",
                y: "0%"
            },
            colors: [ {
                color: "#666",
                offset: 0
            }, {
                color: "#ccc",
                offset: .5
            }, {
                color: "#666",
                offset: 1
            } ]
        },
        id: "__alloyId2"
    });
    $.__views.header.add($.__views.__alloyId2);
    $.__views.addView = Ti.UI.createView({
        top: 0,
        bottom: 0,
        right: 0,
        width: "50dp",
        id: "addView"
    });
    $.__views.header.add($.__views.addView);
    addToDoItem ? $.addListener($.__views.addView, "click", addToDoItem) : __defers["$.__views.addView!click!addToDoItem"] = true;
    $.__views.addImage = Ti.UI.createImageView({
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        color: "#fff",
        backgroundColor: "transparent",
        image: "/ic_menu_add.png",
        touchEnabled: false,
        id: "addImage"
    });
    $.__views.addView.add($.__views.addImage);
    $.__views.todoTable = Ti.UI.createView({
        top: Alloy.Globals.tableTop,
        bottom: "46dp",
        layout: "vertical",
        id: "todoTable",
        dataTransform: "transformFunction"
    });
    $.__views.todoWin.add($.__views.todoTable);
    var __alloyId7 = Alloy.Collections["todo"] || todo;
    __alloyId7.on("fetch destroy change add remove reset", __alloyId8);
    exports.destroy = function() {
        __alloyId7 && __alloyId7.off("fetch destroy change add remove reset", __alloyId8);
    };
    _.extend($, $.__views);
    var todos = Alloy.Collections.todo;
    var INDEXES = {
        All: 0,
        Active: 1,
        Done: 2
    };
    var whereIndex = INDEXES["All"];
    $.todoWin.open();
    todos && todos.fetch();
    __defers["$.__views.addView!click!addToDoItem"] && $.addListener($.__views.addView, "click", addToDoItem);
    __defers["__alloyId6!focus!setQuantity"] && $.addListener(__alloyId6, "focus", setQuantity);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;