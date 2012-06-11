
/**
 * Alloy for Titanium by Appcelerator
 * This is generated code, DO NOT MODIFY - change will be lost!
 * Copyright (c) 2012 by Appcelerator, Inc.
 */
var Alloy = require("alloy"),
    _ = Alloy._,
    A$ = Alloy.A,
    M$ = Alloy.M,
    Backbone = Alloy.Backbone,
    $w = Ti.UI.createWindow();
$w.startLayout();
var $0 = A$(Ti.UI.createView({
    backgroundColor: "white",
    id: "index"
}), "View", $w);
$w.add($0);
var $1 = A$(Ti.Map.createView({
    id: "map"
}), "View", $0);
$0.add($1), function (window, index, map) {
    map.addAnnotations([{
        animate: !0,
        title: "Mountain View, CA",
        latitude: 37.389569,
        longitude: -122.050212
    }, {
        animate: !0,
        title: "Pittsburgh, PA",
        latitude: 40.493893,
        longitude: -80.056856
    }])
}($w, $0, $1), $w.finishLayout(), $w.open()
