function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function myFunction() {
        return true;
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
    $.__views.index = Ti.UI.createWindow({
        layout: "vertical",
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label1 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            top: 20,
            left: 0,
            font: {
                fontSize: "14dp"
            },
            color: "black"
        });
        Alloy.Globals.isiPhone6 && _.extend(o, {
            font: {
                fontSize: "16dp"
            },
            color: "green"
        });
        _.extend(o, {
            color: "blue",
            text: "This is a label",
            id: "label1"
        });
        return o;
    }());
    $.__views.index.add($.__views.label1);
    $.__views.label2 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            top: 20,
            left: 0,
            font: {
                fontSize: "14dp"
            },
            color: "black"
        });
        Alloy.Globals.isiPhone6 && _.extend(o, {
            font: {
                fontSize: "16dp"
            },
            color: "green"
        });
        _.extend(o, {
            color: "blue",
            text: "This is also a label",
            id: "label2"
        });
        return o;
    }());
    $.__views.index.add($.__views.label2);
    $.__views.label3 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            top: 20,
            left: 0,
            font: {
                fontSize: "14dp"
            },
            color: "black"
        });
        Alloy.Globals.isiPhone6 && _.extend(o, {
            font: {
                fontSize: "16dp"
            },
            color: "green"
        });
        _.extend(o, {
            color: "blue",
            text: "Tap for new Window"
        });
        myFunction() && _.extend(o, {
            font: {
                fontSize: "18dp"
            },
            color: "red"
        });
        _.extend(o, {
            id: "label3"
        });
        return o;
    }());
    $.__views.index.add($.__views.label3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.label3.addEventListener("click", function() {
        var child = Alloy.createController("childWindow", {
            someProperty: true
        });
        console.log("__controllerPath = " + child.__controllerPath);
        console.log("args = " + JSON.stringify(child.args));
        child.getView().open();
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;