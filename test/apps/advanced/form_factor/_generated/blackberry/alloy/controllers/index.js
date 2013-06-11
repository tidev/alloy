function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    if (!Alloy.isTablet) {
        $.__views.main = Ti.UI.createView(function() {
            var o = {};
            _.extend(o, {});
            Alloy.isHandheld && _.extend(o, {
                backgroundColor: "blue"
            });
            _.extend(o, {});
            Alloy.isTablet && _.extend(o, {
                backgroundColor: "red"
            });
            _.extend(o, {
                id: "main"
            });
            return o;
        }());
        $.__views.index.add($.__views.main);
        $.__views.label = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "I'm a handheld!",
            id: "label"
        });
        $.__views.main.add($.__views.label);
    }
    if (Alloy.isTablet) {
        $.__views.main = Ti.UI.createView(function() {
            var o = {};
            _.extend(o, {});
            Alloy.isHandheld && _.extend(o, {
                backgroundColor: "blue"
            });
            _.extend(o, {});
            Alloy.isTablet && _.extend(o, {
                backgroundColor: "red"
            });
            _.extend(o, {
                id: "main"
            });
            return o;
        }());
        $.__views.index.add($.__views.main);
        $.__views.label = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "I'm a tablet!",
            id: "label"
        });
        $.__views.main.add($.__views.label);
    }
    $.__views.container = Ti.UI.createView(function() {
        var o = {};
        _.extend(o, {});
        Alloy.isHandheld && _.extend(o, {
            backgroundColor: "blue"
        });
        _.extend(o, {});
        Alloy.isTablet && _.extend(o, {
            backgroundColor: "red"
        });
        _.extend(o, {
            id: "container",
            height: "50",
            width: "200",
            bottom: "10",
            backgroundColor: "#cdcdcd"
        });
        return o;
    }());
    $.__views.index.add($.__views.container);
    if (true && Alloy.isTablet) {
        $.__views.platformLabel = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "blackberry tablet",
            id: "platformLabel"
        });
        $.__views.container.add($.__views.platformLabel);
    }
    if (true && !Alloy.isTablet) {
        $.__views.platformLabel = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "blackberry handheld",
            id: "platformLabel"
        });
        $.__views.container.add($.__views.platformLabel);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;