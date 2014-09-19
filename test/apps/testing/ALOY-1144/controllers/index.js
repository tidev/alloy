function doClick(e) {
    $.label.animate($.createStyle({
            transform: Ti.UI.create2DMatrix().scale(.5, .5),
            duration: 500
        }))
}

$.index.open();
