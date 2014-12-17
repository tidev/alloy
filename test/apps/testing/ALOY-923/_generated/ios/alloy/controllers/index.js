function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function clickRightButton() {
        alert("Right Button");
    }
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
        backgroundColor: "#fff",
        top: Alloy.Globals.winTop,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    var __alloyId0 = {};
    var __alloyId2 = [];
    var __alloyId5 = {
        type: "Ti.UI.Button",
        properties: {
            height: "50dp",
            width: Ti.UI.SIZE,
            right: 0,
            title: "Right"
        },
        events: {
            click: clickRightButton
        }
    };
    var __alloyId6 = {
        type: "Ti.UI.TextField",
        bindId: "textfield",
        childTemplates: function() {
            var __alloyId7 = [];
            var __alloyId8 = {
                type: "Ti.UI.Button",
                properties: {
                    height: "50dp",
                    width: Ti.UI.SIZE,
                    right: 0,
                    title: "Right"
                },
                events: {
                    click: clickRightButton
                }
            };
            __alloyId7.push(__alloyId8);
            return __alloyId7;
        }(),
        properties: {
            width: Ti.UI.FILL,
            bottom: 0,
            font: {
                fontSize: 12
            },
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            rightButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
            rightButton: __alloyId5,
            bindId: "textfield",
            autocorrect: "false",
            hintText: "User name / e-mail address"
        }
    };
    __alloyId2.push(__alloyId6);
    var __alloyId1 = {
        properties: {
            name: "inputTemplate"
        },
        childTemplates: __alloyId2
    };
    __alloyId0["inputTemplate"] = __alloyId1;
    var __alloyId10 = [];
    $.__views.__alloyId11 = {
        template: "inputTemplate",
        textfield: {
            value: ""
        },
        properties: {
            id: "__alloyId11"
        }
    };
    __alloyId10.push($.__views.__alloyId11);
    $.__views.idSection = Ti.UI.createListSection({
        headerTitle: "Login Id",
        id: "idSection"
    });
    $.__views.idSection.items = __alloyId10;
    var __alloyId12 = [];
    __alloyId12.push($.__views.idSection);
    $.__views.listView = Ti.UI.createListView({
        top: 20,
        sections: __alloyId12,
        templates: __alloyId0,
        id: "listView"
    });
    $.__views.index.add($.__views.listView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;