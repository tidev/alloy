function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.foo.widget/" + s : s.substring(0, index) + "/com.foo.widget/" + s.substring(index + 1);
    return path;
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
    new (require("/alloy/widget"))("com.foo.widget");
    this.__widgetId = "com.foo.widget";
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "row_bind";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        var $model = __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.row_bind = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "row_bind"
    });
    $.__views.row_bind && $.addTopLevelView($.__views.row_bind);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: $model.__transform.title,
        id: "__alloyId1"
    });
    $.__views.row_bind.add($.__views.__alloyId1);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;