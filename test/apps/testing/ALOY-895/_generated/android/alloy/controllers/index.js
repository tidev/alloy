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
            var __alloyId3 = models[i];
            __alloyId3.__transform = _.isFunction(__alloyId3.transform) ? __alloyId3.transform() : __alloyId3.toJSON();
            var __alloyId5 = Ti.UI.createTableViewRow({});
            rows.push(__alloyId5);
            var __alloyId7 = Ti.UI.createLabel({
                left: 5,
                font: {
                    fontSize: "18px"
                },
                color: "black",
                text: __alloyId3.__transform.name
            });
            __alloyId5.add(__alloyId7);
            var __alloyId9 = Ti.UI.createSwitch({
                right: 5,
                value: __alloyId3.__transform.status
            });
            __alloyId5.add(__alloyId9);
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
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Collections.instance("heroes");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        title: "data switches",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "toggle",
        top: 5,
        id: "__alloyId2"
    });
    $.__views.index.add($.__views.__alloyId2);
    toggleState ? $.addListener($.__views.__alloyId2, "click", toggleState) : __defers["$.__views.__alloyId2!click!toggleState"] = true;
    $.__views.table = Ti.UI.createTableView({
        id: "table",
        top: 40
    });
    $.__views.index.add($.__views.table);
    var __alloyId10 = Alloy.Collections["heroes"] || heroes;
    __alloyId10.on("fetch destroy change add remove reset", __alloyId11);
    exports.destroy = function() {
        __alloyId10 && __alloyId10.off("fetch destroy change add remove reset", __alloyId11);
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
    __defers["$.__views.__alloyId2!click!toggleState"] && $.addListener($.__views.__alloyId2, "click", toggleState);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;