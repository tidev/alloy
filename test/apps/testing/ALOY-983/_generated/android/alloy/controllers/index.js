function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function openPopover() {
        var popover = Alloy.createController("popover").getView();
        popover.show({
            view: $.button1
        });
    }
    function openPopoverWin() {
        var popover = Alloy.createController("popover_win").getView();
        popover.show({
            view: $.button2
        });
    }
    function openPopoverNavWin() {
        var popover = Alloy.createController("popover_navwin").getView();
        popover.show({
            view: $.button3
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.button1 = Ti.UI.createButton({
        title: "Show View-based Popover",
        id: "button1",
        top: 250
    });
    $.__views.index.add($.__views.button1);
    openPopover ? $.addListener($.__views.button1, "click", openPopover) : __defers["$.__views.button1!click!openPopover"] = true;
    $.__views.button2 = Ti.UI.createButton({
        title: "Show Window-based Popover",
        id: "button2",
        top: 50
    });
    $.__views.index.add($.__views.button2);
    openPopoverWin ? $.addListener($.__views.button2, "click", openPopoverWin) : __defers["$.__views.button2!click!openPopoverWin"] = true;
    $.__views.button3 = Ti.UI.createButton({
        title: "Show NavigationWindow-based Popover",
        id: "button3",
        top: 50
    });
    $.__views.index.add($.__views.button3);
    openPopoverNavWin ? $.addListener($.__views.button3, "click", openPopoverNavWin) : __defers["$.__views.button3!click!openPopoverNavWin"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.button1!click!openPopover"] && $.addListener($.__views.button1, "click", openPopover);
    __defers["$.__views.button2!click!openPopoverWin"] && $.addListener($.__views.button2, "click", openPopoverWin);
    __defers["$.__views.button3!click!openPopoverNavWin"] && $.addListener($.__views.button3, "click", openPopoverNavWin);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;