function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doClick() {
        model.set("title", "Atlas Shrugged");
        model.set("author", "Ayn Rand");
        model.set("genre", "Dystopia");
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
    var __defers = {};
    Alloy.Models.instance("book");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.theButton = Ti.UI.createButton({
        top: 20,
        title: "Click Me",
        id: "theButton"
    });
    $.__views.index.add($.__views.theButton);
    doClick ? $.addListener($.__views.theButton, "click", doClick) : __defers["$.__views.theButton!click!doClick"] = true;
    $.__views.theView = Ti.UI.createView({
        layout: "vertical",
        id: "theView"
    });
    $.__views.index.add($.__views.theView);
    $.__views.title = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: 10,
        id: "title"
    });
    $.__views.theView.add($.__views.title);
    doClick ? $.addListener($.__views.title, "click", doClick) : __defers["$.__views.title!click!doClick"] = true;
    $.__views.author = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: 10,
        id: "author"
    });
    $.__views.theView.add($.__views.author);
    doClick ? $.addListener($.__views.author, "click", doClick) : __defers["$.__views.author!click!doClick"] = true;
    $.__views.genre = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: 10,
        id: "genre"
    });
    $.__views.theView.add($.__views.genre);
    doClick ? $.addListener($.__views.genre, "click", doClick) : __defers["$.__views.genre!click!doClick"] = true;
    var __alloyId2 = function() {
        Alloy["Models"]["book"].__transform = _.isFunction(Alloy["Models"]["book"].transform) ? Alloy["Models"]["book"].transform() : Alloy["Models"]["book"].toJSON();
        $.title.text = Alloy["Models"]["book"]["__transform"]["title"];
        $.author.text = Alloy["Models"]["book"]["__transform"]["author"];
        $.genre.text = Alloy["Models"]["book"]["__transform"]["genre"];
    };
    Alloy["Models"]["book"].on("fetch change destroy", __alloyId2);
    exports.destroy = function() {
        Alloy["Models"]["book"] && Alloy["Models"]["book"].off("fetch change destroy", __alloyId2);
    };
    _.extend($, $.__views);
    var model = Alloy.Models.book;
    $.index.open();
    __defers["$.__views.theButton!click!doClick"] && $.addListener($.__views.theButton, "click", doClick);
    __defers["$.__views.title!click!doClick"] && $.addListener($.__views.title, "click", doClick);
    __defers["$.__views.author!click!doClick"] && $.addListener($.__views.author, "click", doClick);
    __defers["$.__views.genre!click!doClick"] && $.addListener($.__views.genre, "click", doClick);
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;