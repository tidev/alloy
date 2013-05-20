function Controller() {
    require("alloy/controllers/baseDialog").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.baseController = "baseDialog";
    exports.openDialog = function(win) {
        $.refWin = win;
        $.cover.opacity = 0;
        $.dialog.opacity = 0;
        $.refWin.add($.cover);
        $.refWin.add($.dialog);
        $.cover.animate({
            duration: 500,
            opacity: .5
        });
        $.dialog.animate({
            duration: 500,
            opacity: 1
        });
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;