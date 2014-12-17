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
        layout: "vertical",
        backgroundColor: "white",
        top: 20,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.title1 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            top: 10,
            text: "Alloy.Globals.someProperty!=true",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && _.extend(o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        _.extend(o, {
            color: "blue",
            text: "Platform: this is iOS"
        });
        Alloy.Globals.someProperty && _.extend(o, {
            text: "Overriding platform with custom TSS"
        });
        _.extend(o, {
            id: "title1"
        });
        return o;
    }());
    $.__views.index.add($.__views.title1);
    $.__views.title2 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            top: 10,
            text: "Alloy.Globals.someProperty!=true",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && _.extend(o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        _.extend(o, {
            color: "blue"
        });
        Alloy.Globals.someProperty && _.extend(o, {
            text: "Platform: iOS, Alloy.Globals.someProperty==true"
        });
        _.extend(o, {
            id: "title2"
        });
        return o;
    }());
    $.__views.index.add($.__views.title2);
    $.__views.title3 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            top: 10,
            text: "Alloy.Globals.someProperty!=true",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && _.extend(o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        _.extend(o, {
            color: "blue",
            text: "You should see this for label 3",
            id: "title3"
        });
        return o;
    }());
    $.__views.index.add($.__views.title3);
    $.__views.title4 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            top: 10,
            text: "Alloy.Globals.someProperty!=true",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && _.extend(o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        _.extend(o, {
            id: "title4"
        });
        return o;
    }());
    $.__views.index.add($.__views.title4);
    if (Alloy.Globals.someProperty) {
        $.__views.title5 = Ti.UI.createLabel(function() {
            var o = {};
            _.extend(o, {
                top: 10,
                text: "Alloy.Globals.someProperty!=true",
                font: {
                    fontSize: "14dp"
                }
            });
            Alloy.Globals.someProperty && _.extend(o, {
                text: "Custom TSS: Alloy.Globals.someProperty==true"
            });
            _.extend(o, {
                color: "blue",
                id: "title5"
            });
            return o;
        }());
        $.__views.index.add($.__views.title5);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;