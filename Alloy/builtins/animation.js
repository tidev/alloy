/**
 * A collection of useful Animation utilities
 */

exports.crossFade = function (from, to, duration, callback) {
    if (from)
        from.animate({
            opacity: 0,
            duration: duration
        });
    if (to)
        to.animate({
            opacity: 1,
            duration: duration
        });
    if (callback)
        setTimeout(callback, duration + 300);
};

exports.fadeAndRemove = function (from, duration, container) {
    if (from && container) {
        from.animate({
            opacity: 0,
            duration: duration
        }, function () {
            container.remove(from);
            container = from = duration = null;
        });
    }
};

exports.fadeIn = function (to, duration) {
    if (to) {
        to.animate({
            opacity: 1,
            duration: duration
        });
    }
};

exports.popIn = function (view) {
	if (!OS_IOS) 
	{
        view.transform = Ti.UI.create2DMatrix();
        view.opacity = 1;
        return;
    }

    var animate1 = Ti.UI.createAnimation({
        opacity: 1,
        transform: Ti.UI.create2DMatrix().scale(1.05, 1.05),
        duration: 200
    });
    var animate2 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix(),
        duration: 300
    });

    exports.chainAnimate(view, [ animate1, animate2 ]);
    view = null;
};

exports.shake = function (view, delay) {
    var shake1 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(5, 0),
        duration: 100
    });
    var shake2 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(-5, 0),
        duration: 100
    });
    var shake3 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(5, 0),
        duration: 100
    });
    var shake4 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(-5, 0),
        duration: 100
    });
    var shake5 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix(),
        duration: 100
    });
    if (delay) {
        setTimeout(function () {
            exports.chainAnimate(view, [ shake1, shake2, shake3, shake4, shake5 ]);
            view = shake1 = shake2 = shake3 = shake4 = shake5 = null;
        }, delay);
    }
    else {
        exports.chainAnimate(view, [ shake1, shake2, shake3, shake4, shake5 ]);
    }
};

exports.flash = function (view, delay) {
    var flash1 = Ti.UI.createAnimation({
        opacity: 0.7,
        duration: 100
    });
    var flash2 = Ti.UI.createAnimation({
        opacity: 1,
        duration: 100
    });
    var flash3 = Ti.UI.createAnimation({
        opacity: 0.7,
        duration: 100
    });
    var flash4 = Ti.UI.createAnimation({
        opacity: 1,
        duration: 100
    });
    if (delay) {
        setTimeout(function () {
            exports.chainAnimate(view, [ flash1, flash2, flash3, flash4 ]);
            view = flash1 = flash2 = flash3 = flash4 = null;
        }, delay);
    }
    else {
        exports.chainAnimate(view, [ flash1, flash2, flash3, flash4 ]);
    }
};

exports.chainAnimate = function (view, animations) {
    function step() {
        if (animations.length == 0) {
            view = animations = null;
            return;
        }
        var animation = animations.shift();
        animation.addEventListener('complete', step);
        view.animate(animation);
    }

    step();
};
