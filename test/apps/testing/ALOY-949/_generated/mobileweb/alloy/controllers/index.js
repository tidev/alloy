function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function changeNothing() {
        dialogs.confirm({
            callback: changeWithExports
        });
    }
    function changeWithExports() {
        dialogs.title = "Confirm (exports)";
        dialogs.message = "For real?";
        dialogs.buttonNames = [ "Naaah", "Fo shizzle" ];
        dialogs.confirm({
            callback: changeWithArgs
        });
    }
    function changeWithArgs() {
        dialogs.confirm({
            title: "Confirm (args.buttonNames)",
            message: "Are the args.buttonNames working?",
            buttonNames: [ "Nope", "Yup" ],
            callback: changeWithArgsAgain
        });
    }
    function changeWithArgsAgain() {
        dialogs.confirm({
            title: "Confirm (args.no:Neh & args.yes:Yeah)",
            message: "Are the args.no & args.yes taking precedence?",
            buttonNames: [ "Nope", "Yup" ],
            no: "Neh",
            yes: "Yeah",
            callback: shouldUseExportsAgainByDefault
        });
    }
    function shouldUseExportsAgainByDefault() {
        dialogs.confirm();
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var dialogs = require("alloy/dialogs");
    $.index.open();
    changeNothing();
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;