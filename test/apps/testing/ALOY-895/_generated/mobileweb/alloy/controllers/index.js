function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId13(e) {
        if (e && e.fromAdapter) return;
        __alloyId13.opts || {};
        var models = __alloyId12.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId5 = models[i];
            __alloyId5.__transform = _.isFunction(__alloyId5.transform) ? __alloyId5.transform() : __alloyId5.toJSON();
            var __alloyId7 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId7);
            var __alloyId9 = Ti.UI.createLabel({
                left: 5,
                text: __alloyId5.__transform.name
            });
            __alloyId7.add(__alloyId9);
            var __alloyId11 = Ti.UI.createSwitch({
                right: 5,
                value: __alloyId5.__transform.status
            });
            __alloyId7.add(__alloyId11);
        }
        $.__views.table.setData(rows);
    }
    function toggleState() {
        _.each(Alloy.Collections.heroes.models, function(model) {
            model.set("status", Math.random() > .5);
        });
    }
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
    var __defers = {};
    Alloy.Collections.instance("heroes");
    $.__views.__alloyId2 = Ti.UI.createWindow({
        title: "data switches",
        id: "__alloyId2"
    });
    $.__views.__alloyId4 = Ti.UI.createButton({
        title: "toggle",
        id: "__alloyId4"
    });
    toggleState ? $.addListener($.__views.__alloyId4, "click", toggleState) : __defers["$.__views.__alloyId4!click!toggleState"] = true;
    $.__views.__alloyId2.rightNavButton = $.__views.__alloyId4;
    $.__views.table = Ti.UI.createTableView({
        id: "table",
        top: 20
    });
    $.__views.__alloyId2.add($.__views.table);
    var __alloyId12 = Alloy.Collections["heroes"] || heroes;
    __alloyId12.on("fetch destroy change add remove reset", __alloyId13);
    $.__views.index = Ti.UI.iOS.createNavigationWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        window: $.__views.__alloyId2,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId12 && __alloyId12.off("fetch destroy change add remove reset", __alloyId13);
    };
    _.extend($, $.__views);
    if (!Ti.App.Properties.hasProperty("seeded")) {
        Alloy.Collections.heroes.reset([ {
            name: "Superman",
            status: false
        }, {
            name: "Batman",
            status: true
        }, {
            name: "Spiderman",
            status: false
        }, {
            name: "Wonder Woman",
            status: true
        }, {
            name: "Tony Lukasavage",
            status: false
        } ]);
        Alloy.Collections.heroes.each(function(_m) {
            _m.save();
        });
        Ti.App.Properties.setString("seeded", "yuppers");
        Alloy.Collections.heroes.fetch();
    }
    Alloy.Collections.heroes.fetch();
    $.index.open();
    __defers["$.__views.__alloyId4!click!toggleState"] && $.addListener($.__views.__alloyId4, "click", toggleState);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;