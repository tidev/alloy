function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
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
        Alloy.deepExtend(true, o, {
            top: 10,
            text: "Default label text",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        Alloy.deepExtend(true, o, {
            color: "blue"
        });
        Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
            text: "Overriding platform with custom TSS"
        });
        Alloy.deepExtend(true, o, {
            id: "title1"
        });
        return o;
    }());
    $.__views.index.add($.__views.title1);
    $.__views.title2 = Ti.UI.createLabel(function() {
        var o = {};
        Alloy.deepExtend(true, o, {
            top: 10,
            text: "Default label text",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        Alloy.deepExtend(true, o, {
            color: "blue"
        });
        Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
            text: "Platform: Android, Alloy.Globals.someProperty==true"
        });
        Alloy.deepExtend(true, o, {
            id: "title2"
        });
        return o;
    }());
    $.__views.index.add($.__views.title2);
    $.__views.title3 = Ti.UI.createLabel(function() {
        var o = {};
        Alloy.deepExtend(true, o, {
            top: 10,
            text: "Default label text",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        Alloy.deepExtend(true, o, {
            color: "blue",
            text: "You should see this for label 3",
            id: "title3"
        });
        return o;
    }());
    $.__views.index.add($.__views.title3);
    $.__views.title4 = Ti.UI.createLabel(function() {
        var o = {};
        Alloy.deepExtend(true, o, {
            top: 10,
            text: "Default label text",
            font: {
                fontSize: "14dp"
            }
        });
        Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
            text: "Custom TSS: Alloy.Globals.someProperty==true"
        });
        Alloy.deepExtend(true, o, {
            id: "title4"
        });
        return o;
    }());
    $.__views.index.add($.__views.title4);
    if (Alloy.Globals.someProperty) {
        $.__views.title5 = Ti.UI.createLabel(function() {
            var o = {};
            Alloy.deepExtend(true, o, {
                top: 10,
                text: "Default label text",
                font: {
                    fontSize: "14dp"
                }
            });
            Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
                text: "Custom TSS: Alloy.Globals.someProperty==true"
            });
            Alloy.deepExtend(true, o, {
                color: "blue",
                id: "title5"
            });
            return o;
        }());
        $.__views.index.add($.__views.title5);
    }
    if (true && Alloy.Globals.someProperty) {
        $.__views.title6 = Ti.UI.createLabel(function() {
            var o = {};
            Alloy.deepExtend(true, o, {
                top: 10,
                text: "Default label text",
                font: {
                    fontSize: "14dp"
                }
            });
            Alloy.Globals.someProperty && Alloy.deepExtend(true, o, {
                text: "Custom TSS: Alloy.Globals.someProperty==true"
            });
            Alloy.deepExtend(true, o, {
                color: "blue",
                id: "title6"
            });
            return o;
        }());
        $.__views.index.add($.__views.title6);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;