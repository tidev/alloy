var _win;
var _openViews = [];

exports.use = function (win) {
    if (_win) {
        _win.close();
    }
    _win = win;
    _openViews = [];
};

exports.getWindow = function () {
    return _win;
};


exports.open = function (evt) {
    var component = evt.component || require("alloy/components/" + evt.id).create(evt);
    var view = component.getRoot();

    // Close anyone with the same ID that is already open.
    exports.close({ id: evt.id, instant: true });

    _openViews.push({
        id: evt.id,
        component: component,
        view: view
    });
    if (!evt.instant) {
        view.opacity = 0;
    }
    _win.add(view);
    component.open(function () {
        if (!evt.instant) {
            view.animate(Ti.UI.createAnimation({
                opacity: 1,
                duration: 300
            }));
            view = null;
        }
    });

    evt = null;

    return view;
};


exports.close = function (evt) {
    var view, component;
    for (var i = _openViews.length - 1; i >= 0; i--) {
        if (evt.id == _openViews[i].id) {
            view = _openViews[i].view;
            component = _openViews[i].component;
            // TODO: give topmost view an API point for overriding closing; lets Android handle back button gracefully.
            _openViews.splice(i, 1);
            break;
        }
    }

    if (view) {
        if (evt.instant) {
            _win.remove(view);
        }
        else {
            view.animate(Ti.UI.createAnimation({
                opacity: 0,
                duration: 300
            }));
            if (component) {
                component.cleanup && component.cleanup();
                delete component.cleanup;
            }
            setTimeout(function () {
                _win.remove(view);
                view = null;
            }, 1000);
        }
    }

    evt = null;
    return view;
};

function closeTopmost() {
    if (_openViews.length == 1) {
        _win.close();
    }
    else {
        var view = _openViews.pop();
        _win.remove(view.view);
    }
}

if (Ti.Platform.name === 'iPhone OS') {
    var lastBottom;
    Ti.App.addEventListener('keyboardFrameChanged', function keyboardFrameChanged(evt) {
        var newBottom = evt.keyboardFrame.y;
        if (lastBottom != newBottom) {
            _win.animate({
                bottom: Ti.Platform.displayCaps.platformHeight - newBottom,
                duration: 50
            });
            lastBottom = newBottom;
        }
    });
}
