function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.test.hellobutton/" + s : s.substring(0, index) + "/com.test.hellobutton/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function sayHello() {
        require(WPATH("hello")).sayHello();
    }
    new (require("alloy/widget"))("com.test.hellobutton");
    this.__widgetId = "com.test.hellobutton";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.helloButton = Ti.UI.createButton({
        backgroundImage: WPATH("hello.png"),
        height: 135,
        width: 233,
        id: "helloButton"
    });
    $.__views.helloButton && $.addTopLevelView($.__views.helloButton);
    sayHello ? $.__views.helloButton.addEventListener("click", sayHello) : __defers["$.__views.helloButton!click!sayHello"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.helloButton!click!sayHello"] && $.__views.helloButton.addEventListener("click", sayHello);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;