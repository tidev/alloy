function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var childView = Alloy.createController("childview");
    childView.updateViews({
        "#label": {
            text: "I am a label",
            top: 50,
            width: Ti.UI.FILL,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            ellipsize: false,
            backgroundGradient: {
                type: "linear",
                startPoint: {
                    x: "0%",
                    y: "50%"
                },
                endPoint: {
                    x: "100%",
                    y: "50%"
                },
                colors: [ {
                    color: "red",
                    offset: 0
                }, {
                    color: "blue",
                    offset: .25
                }, {
                    color: "red",
                    offset: 1
                } ]
            }
        },
        "#anotherlabel": {
            text: "I am also a label",
            foo: "bar"
        },
        "#someNonExistentId": {
            text: "I do not exist"
        }
    });
    $.index.add(childView.getView());
    var opts = {
        "#normallabel": {
            text: "i used updateViews()",
            color: "#a00",
            font: {
                fontWeight: "bold",
                fontSize: 24
            },
            bottom: 50
        }
    };
    $.index.add(Alloy.createController("normalchild").updateViews(opts).getView());
    $.index.add(Alloy.createController("normalchild", {
        text: "Set the old-fashioned way"
    }).getView());
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;