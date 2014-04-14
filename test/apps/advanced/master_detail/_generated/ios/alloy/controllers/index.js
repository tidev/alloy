function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "row";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        backgroundColor: "#fff",
        height: "60dp",
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.name = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "5dp",
        left: "10dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        id: "name"
    });
    $.__views.row.add($.__views.name);
    $.__views.nickname = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        bottom: "5dp",
        left: "20dp",
        font: {
            fontSize: "16dp",
            fontWeight: "normal"
        },
        id: "nickname"
    });
    $.__views.row.add($.__views.nickname);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.row.fighterName = $.name.text = args.name;
    $.nickname.text = args.nickname;
    require("specs/row")($, {
        name: args.name,
        nickname: args.nickname
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;ablet ? $.detail : Alloy.createController("detail");
        var win = controller.getView();
        controller.setBoxerStats(e.row.fighterName);
        true && Alloy.isHandheld && Alloy.Globals.navgroup.openWindow(win);
    });
    $.index.open();
    require("specs/index")($);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;setBoxerStats = function(name) {
        var stats = Alloy.Globals.data[name];
        $.detail.title = name;
        $.age.text = "Age: " + stats.age;
        $.height.text = "Height: " + stats.height;
        $.weight.text = "Weight: " + stats.weight;
        $.record.text = "Record: " + stats.record;
        require("specs/detail")($, {
            name: name,
            stats: stats
        });
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;