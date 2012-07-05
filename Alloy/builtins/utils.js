exports.dbg = function () {
    return false;
};

exports.android = Ti.Platform.name === 'android';
exports.ios = Ti.Platform.name === 'iPhone OS';
exports.iphone = Ti.Platform.osname === 'iphone';
exports.ipad = Ti.Platform.osname === 'ipad';
exports.iosRetina = Ti.Platform.name === 'iPhone OS' && Ti.Platform.displayCaps.density == 'high';
exports.mobileweb = Ti.Platform.osname === 'mobileweb';

exports.dpToPX = function (val) {
    if (!exports.android) {
        return val;
    }
    return val * Ti.Platform.displayCaps.dpi / 160;
};
exports.pxToDP = function (val) {
    if (!exports.android) {
        return val;
    }
    return val / Ti.Platform.displayCaps.dpi * 160;
};
exports.pointPXToDP = function (pt) {
    if (!exports.android) {
        return pt;
    }
    return { x: exports.pxToDP(pt.x), y: exports.pxToDP(pt.y) };
};

var listeners = {};

exports.addEventListener = function (name, func) {
    if (!listeners[name]) {
        listeners[name] = [];
    }
    listeners[name].push(func);
    return exports;
};

exports.clearEventListeners = function () {
    for (var name in listeners) {
        for (var l in listeners[name]) {
            delete listeners[name][l];
        }
        delete listeners[name];
    }
};

exports.fireEvent = function (name, data) {
    if (!listeners[name]) {
        return;
    }
    for (var l in listeners[name]) {
        listeners[name][l](data);
    }
    return exports;
};

exports.curryFireEvent = function (name, data) {
    return function () {
        if (!listeners[name]) {
            return;
        }
        for (var l in listeners[name]) {
            listeners[name][l](data);
        }
        return exports;
    }
};

exports.removeEventListener = function (name, func) {
    for (var l in listeners[name]) {
        if (listeners[name][l] === func) {
            listeners[name].splice(l, 1);
            break;
        }
    }
    return exports;
};

exports.trimZeros = function (num) {
    var str = new String(num || '0');
    if (str.indexOf('.') == -1)
        return str;
    return str.replace(/\.?0*$/, '');
};

exports.ucfirst = function (text) {
    if (!text)
        return text;
    return text[0].toUpperCase() + text.substr(1);
};

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
    if (!require('data/settings').allowAnimations()) {
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

exports.def = function (dict, defs) {
    for (var key in defs) {
        if (!defs.hasOwnProperty(key))
            continue;
        if (dict[key] === undefined) {
            dict[key] = defs[key];
        }
    }
};

exports.handleActionableTarget = function (evt) {
    if (!evt
        || !evt.source
        || evt.source.action === undefined
        || (evt.source.target === undefined && evt.source.text === undefined))
        return;
    var action = evt.source.action;
    var target = evt.source.target || evt.source.text;
    var cleanTarget = target.split('\n').join(' ');
    if (cleanTarget.indexOf('http') == 0) {
        action = '';
    }
    if (action == 'tel://') {
        //cleanTarget = cleanTarget.replace(/[\\(\\)\\.-\\ ]/g, '');
    }

    var together = action + cleanTarget;
    if (!Ti.Platform.canOpenURL(together)) {
        Ti.UI.Clipboard.setText(cleanTarget);
        Ti.UI.createAlertDialog({
            title: 'Copied to Clipboard!',
            message: cleanTarget
        }).show();
    }
    else {
        var appName = 'External Application';
        if (together.split('maps.google.com').length > 1) {
            appName = 'Google Maps';
        }
        else if (together.split('http://').length > 1) {
            appName = 'Safari';
        }
        else if (action == 'tel://') {
            appName = 'Phone';
        }
        else if (action == 'mailto://') {
            appName = 'Mail';
        }
        exports.confirm({
            title: 'Launching ' + appName,
            message: 'Are you sure?',
            callback: function () {
                Ti.Platform.openURL(action + cleanTarget);
                action = cleanTarget = null;

            }
        });
    }

    evt = null;
};

exports.confirm = function (args) {
    var alertDialog = Ti.UI.createAlertDialog({
        title: args.title || 'Confirm',
        message: args.message || 'Are you sure?',
        buttonNames: [args.no || 'No', args.yes || 'Yes'],
        cancel: 0
    });
    alertDialog.addEventListener('click', function (evt) {
        if (evt.index) {
            args.callback && args.callback(args.evt || {});
        }
        args = null;
    });
    alertDialog.show();
};

exports.stringToDate = function (str) {
    if (!str || str == '0000-00-00T00:00:00') {
        return null;
    }
    if (typeof str == 'string') {
        var val = new Date(str.replace(/-/g, '/').replace(/[TZ]/g, ' '));
        if (val && val != 'undefined')
            return val;
        return null;
    }
    return str;
};

exports.formatAsTime = function (time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime)
        return '';

    var aa = 'AM';

    var hours = date.getHours();
    if (hours >= 12) {
        aa = 'PM';
        hours -= 12;
    }
    if (hours == 0) {
        hours = '12';
    }

    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return hours + ':' + minutes + ' ' + aa;
};

exports.formatCurrency = function (amount) {
    if (exports.mobileweb) {
        var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;
        return '$' + parseFloat(num).toFixed(2);
    }
    return String.formatCurrency(amount);
};

exports.formatAsDayMonth = function (time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime)
        return '';

    var month = date.getMonth() + 1;

    var day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return month + '/' + day;
};

exports.formatAsDOWMonthDayYear = function (time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime)
        return '';

    var dow = getDayOfWeek(date);
    var month = getMonth(date);
    var day = date.getDate();
    switch (day) {
        case 31:
        case 21:
        case 1:
            day += 'st';
            break;
        case 22:
        case 2:
            day += 'nd';
            break;
        case 3:
            day += 'rd';
            break;
        default:
            day += 'th';
            break;
    }
    var year = date.getFullYear();
    return dow + ' ' + month + ' ' + day + ', ' + year;
};

exports.formatAsShort = function (time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime)
        return '';

    var today = new Date();
    var yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    var diff = Math.abs(((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0)
        return;

    var day = '';
    if (areDatesEqual(date, today)) {
        day = 'Today';
    }
    else if (areDatesEqual(date, yesterday)) {
        day = 'Yesterday';
    }
    else if (areDatesEqual(date, tomorrow)) {
        day = 'Tomorrow';
    }
    else if (day_diff < 7) {
        day = getDayOfWeek(date);
    }
    else {
        day = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    return day; // + ' @' + getTime(date);
};

function getMonth(date) {
    switch (date.getMonth()) {
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        default:
            return 'December';
    }
}

function getDayOfWeek(date) {
    switch (date.getDay()) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        default:
            return 'Saturday';
    }
}

function getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var period = hours > 11 ? 'pm' : 'am';
    if (hours > 12) { hours = hours - 12; }
    if (hours == 0) { hours = 12; }
    minutes = String(minutes).length == 1 ? '0' + String(minutes) : minutes;
    return hours + ':' + minutes + period;
}

function areDatesEqual(date1, date2) {
    return (date1.getMonth() + '/' + date1.getDate() + '/' + date1.getFullYear()) ===
        (date2.getMonth() + '/' + date2.getDate() + '/' + date2.getFullYear());
}