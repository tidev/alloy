/**
 * Alloy for Titanium by Appcelerator
 * This is generated code, DO NOT MODIFY - changes will be lost!
 * Copyright (c) 2012 by Appcelerator, Inc.
 */
var Alloy = require("alloy"), _ = Alloy._, A$ = Alloy.A, M$ = Alloy.M, BC$ = Alloy.Backbone.Collection, TFL$ = Ti.UI.FILL, TSZ$ = Ti.UI.SIZE, $ = {};

$.master = A$(Ti.UI.createWindow({
    backgroundColor: "white",
    layout: "vertical",
    id: "master"
}), "Window"), $.table = A$(Ti.UI.createTableView({
    id: "table"
}), "TableView", $.master), $.master.add($.table), function(exports) {
    $.table.setData([ Ti.UI.createTableViewRow({
        title: "Alcatraz",
        image: "smallpic1.jpg"
    }), Ti.UI.createTableViewRow({
        title: "American Flag",
        image: "smallpic2.jpg"
    }), Ti.UI.createTableViewRow({
        title: "Penitentiary Sign",
        image: "smallpic3.jpg"
    }) ]), $.table.addEventListener("click", function(e) {
        exports.fireEvent("rowClick", {
            image: e.row.image
        });
    });
}($.master), $.detail = A$(Ti.UI.createWindow({
    backgroundColor: "white",
    layout: "vertical",
    id: "detail"
}), "Window"), $.image = A$(Ti.UI.createImageView({
    height: "200dp",
    width: "200dp",
    top: "20dp",
    id: "image"
}), "ImageView", $.detail), $.detail.add($.image), $.closeButton = A$(Ti.UI.createButton({
    top: "20dp",
    title: "go back",
    id: "closeButton"
}), "Button", $.detail), $.detail.add($.closeButton), function(exports) {
    $.detail.updateContent = function(o) {
        $.image.image = o.image;
    }, $.closeButton.addEventListener("click", function(e) {
        exports.close();
    });
}($.detail), function(exports) {
    $.master.open(), $.master.addEventListener("rowClick", function(e) {
        $.detail.updateContent(e), $.detail.open();
    });
}($.index);
