function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function TFUpdate() {}
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
    $.__views.settingsWin = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "settingsWin",
        title: "Settings",
        tabBarHidden: "true"
    });
    $.__views.settingsWin && $.addTopLevelView($.__views.settingsWin);
    var __alloyId0 = {};
    var __alloyId2 = [];
    var __alloyId3 = {
        type: "Ti.UI.TextField",
        bindId: "textfield",
        properties: {
            bindId: "textfield",
            autocorrect: "false",
            hintText: "User name / e-mail address"
        },
        events: {
            change: TFUpdate
        }
    };
    __alloyId2.push(__alloyId3);
    var __alloyId1 = {
        properties: {
            name: "inputTemplate"
        },
        childTemplates: __alloyId2
    };
    __alloyId0["inputTemplate"] = __alloyId1;
    var __alloyId5 = [];
    $.__views.__alloyId6 = {
        template: "inputTemplate",
        textfield: {
            value: ""
        },
        properties: {
            id: "__alloyId6"
        }
    };
    __alloyId5.push($.__views.__alloyId6);
    $.__views.idSection = Ti.UI.createListSection({
        headerTitle: "Login Id",
        id: "idSection"
    });
    $.__views.idSection.items = __alloyId5;
    var __alloyId7 = [];
    __alloyId7.push($.__views.idSection);
    $.__views.listView = Ti.UI.createListView({
        sections: __alloyId7,
        templates: __alloyId0,
        id: "listView",
        defaultItemTemplate: "template",
        allowsSelection: "false"
    });
    $.__views.settingsWin.add($.__views.listView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.settingsWin.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;