function closeTopmost() {
    if (_openViews.length == 1) _win.close(); else {
        var view = _openViews.pop();
        _win.remove(view.view);
    }
}

var _win, _openViews = [];

exports.use = function(win) {
    _win && _win.close(), _win = win, _openViews = [];
}, exports.getWindow = function() {
    return _win;
}, exports.open = function(evt) {
    var component = require("alloy/components/" + evt.id).create(evt), view = component[evt.id];
    return exports.close({
        id: evt.id,
        instant: !0
    }), _openViews.push({
        id: evt.id,
        view: view
    }), evt.instant || (view.opacity = 0), _win.add(view), component.open(function() {
        evt.instant || (view.animate(Ti.UI.createAnimation({
            opacity: 1,
            duration: 300
        })), view = null);
    }), evt = null, view;
}, exports.close = function(evt) {
    var view;
    for (var i = _openViews.length - 1; i >= 0; i--) if (evt.id == _openViews[i].id) {
        view = _openViews[i].view, _openViews.splice(i, 1);
        break;
    }
    return view && (evt.instant ? _win.remove(view) : (view.animate(Ti.UI.createAnimation({
        opacity: 0,
        duration: 300
    })), view.cleanup && view.cleanup(), delete view.cleanup, setTimeout(function() {
        _win.remove(view), view = null;
    }, 1e3))), evt = null, view;
};

if (Ti.Platform.name === "iPhone OS") {
    var lastBottom;
    Ti.App.addEventListener("keyboardFrameChanged", function(evt) {
        var newBottom = evt.keyboardFrame.y;
        lastBottom != newBottom && (_win.animate({
            bottom: Ti.Platform.displayCaps.platformHeight - newBottom,
            duration: 50
        }), lastBottom = newBottom);
    });
}