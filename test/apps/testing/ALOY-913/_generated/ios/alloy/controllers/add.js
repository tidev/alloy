function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function addItem() {
        var todos = Alloy.Collections.todo;
        var task = Alloy.createModel("Todo", {
            item: $.itemField.value,
            done: 0
        });
        todos.add(task);
        task.save();
        todos.fetch();
        closeWindow();
    }
    function focusTextField() {
        $.itemField.focus();
    }
    function closeKeyboard(e) {
        e.source.blur();
    }
    function closeWindow() {
        $.addWin.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "add";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.addWin = Ti.UI.createWindow({
        backgroundColor: "#fff",
        layout: "vertical",
        barColor: "#a00",
        id: "addWin",
        title: "Add Item",
        modal: true
    });
    $.__views.addWin && $.addTopLevelView($.__views.addWin);
    focusTextField ? $.addListener($.__views.addWin, "open", focusTextField) : __defers["$.__views.addWin!open!focusTextField"] = true;
    $.__views.itemField = Ti.UI.createTextField({
        width: "90%",
        top: "25dp",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        returnKeyType: Ti.UI.RETURNKEY_DONE,
        id: "itemField",
        hintText: "What do you need to do?"
    });
    $.__views.addWin.add($.__views.itemField);
    closeKeyboard ? $.addListener($.__views.itemField, "return", closeKeyboard) : __defers["$.__views.itemField!return!closeKeyboard"] = true;
    $.__views.__alloyId0 = Ti.UI.createButton({
        width: "50%",
        top: "20dp",
        title: "Add Item",
        id: "__alloyId0"
    });
    $.__views.addWin.add($.__views.__alloyId0);
    addItem ? $.addListener($.__views.__alloyId0, "click", addItem) : __defers["$.__views.__alloyId0!click!addItem"] = true;
    $.__views.__alloyId1 = Ti.UI.createButton({
        width: "50%",
        top: "20dp",
        title: "Cancel",
        id: "__alloyId1"
    });
    $.__views.addWin.add($.__views.__alloyId1);
    closeWindow ? $.addListener($.__views.__alloyId1, "click", closeWindow) : __defers["$.__views.__alloyId1!click!closeWindow"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.addWin!open!focusTextField"] && $.addListener($.__views.addWin, "open", focusTextField);
    __defers["$.__views.itemField!return!closeKeyboard"] && $.addListener($.__views.itemField, "return", closeKeyboard);
    __defers["$.__views.__alloyId0!click!addItem"] && $.addListener($.__views.__alloyId0, "click", addItem);
    __defers["$.__views.__alloyId1!click!closeWindow"] && $.addListener($.__views.__alloyId1, "click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;