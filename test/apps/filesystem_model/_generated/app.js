/**
 * Alloy for Titanium by Appcelerator
 * This is generated code, DO NOT MODIFY - changes will be lost!
 * Copyright (c) 2012 by Appcelerator, Inc.
 */
var Alloy = require("alloy"), _ = Alloy._, A$ = Alloy.A, M$ = Alloy.M, BC$ = Alloy.Backbone.Collection, TFL$ = Ti.UI.FILL, TSZ$ = Ti.UI.SIZE, $ = {};

$.CFG = {}, $.Book = M$("book", {
    defaults: {
        type: "fiction"
    },
    adapter: {
        type: "filesystem",
        filename: "books"
    }
}, function(book) {}, []), $.BookCollection = BC$.extend({
    model: $.Book
}), $.BookCollection.prototype.model = $.Book, $.BookCollection.prototype.config = $.Book.prototype.config, $.index = A$(Ti.UI.createWindow({
    id: "index"
}), "Window"), $.table = A$(Ti.UI.createTableView({
    id: "table"
}), "TableView", $.index), $.index.add($.table), function(exports) {
    $.BookCollection.notify.on("refresh", function(e) {
        if (e.method === "read") {
            var rows = [];
            for (var i = 0; i < e.model.length; i++) {
                var m = e.model.models[i], title = m.attributes.book + " - " + m.attributes.author;
                rows.push(Ti.UI.createTableViewRow({
                    title: title
                }));
            }
            $.table.setData(rows);
        }
    });
    var books = new $.BookCollection;
    books.add({
        book: "War and Peace",
        author: "Tolstoy"
    }), books.add({
        book: "Light in August",
        author: "Faulkner"
    }), books.forEach(function(model) {
        model.save();
    }), books.fetch(), books.forEach(function(model) {
        model.destroy();
    }), exports.open();
}($.index);