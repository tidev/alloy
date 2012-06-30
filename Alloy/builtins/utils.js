function getMonth(date) {
    switch (date.getMonth()) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      default:
        return "December";
    }
}

function getDayOfWeek(date) {
    switch (date.getDay()) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      default:
        return "Saturday";
    }
}

function getTime(date) {
    var hours = date.getHours(), minutes = date.getMinutes(), period = hours > 11 ? "pm" : "am";
    return hours > 12 && (hours -= 12), hours == 0 && (hours = 12), minutes = String(minutes).length == 1 ? "0" + String(minutes) : minutes, hours + ":" + minutes + period;
}

function areDatesEqual(date1, date2) {
    return date1.getMonth() + "/" + date1.getDate() + "/" + date1.getFullYear() == date2.getMonth() + "/" + date2.getDate() + "/" + date2.getFullYear();
}

exports.dbg = function() {
    return !1;
}, exports.android = Ti.Platform.name === "android", exports.ios = Ti.Platform.name === "iPhone OS", exports.iphone = Ti.Platform.osname === "iphone", exports.ipad = Ti.Platform.osname === "ipad", exports.iosRetina = Ti.Platform.name === "iPhone OS" && Ti.Platform.displayCaps.density == "high", exports.mobileweb = Ti.Platform.osname === "mobileweb", exports.pxToDP = function(val) {
    return exports.android ? val / (Ti.Platform.displayCaps.dpi / 160) : val;
}, exports.pointToDP = function(pt) {
    return exports.android ? {
        x: exports.pxToDP(pt.x),
        y: exports.pxToDP(pt.y)
    } : pt;
};

var listeners = {};

exports.addEventListener = function(name, func) {
    return listeners[name] || (listeners[name] = []), listeners[name].push(func), exports;
}, exports.clearEventListeners = function() {
    for (var name in listeners) {
        for (var l in listeners[name]) delete listeners[name][l];
        delete listeners[name];
    }
}, exports.fireEvent = function(name, data) {
    if (!listeners[name]) return;
    for (var l in listeners[name]) listeners[name][l](data);
    return exports;
}, exports.curryFireEvent = function(name, data) {
    return function() {
        if (!listeners[name]) return;
        for (var l in listeners[name]) listeners[name][l](data);
        return exports;
    };
}, exports.removeEventListener = function(name, func) {
    for (var l in listeners[name]) if (listeners[name][l] === func) {
        listeners[name].splice(l, 1);
        break;
    }
    return exports;
}, exports.trimZeros = function(num) {
    var str = new String(num || "0");
    return str.indexOf(".") == -1 ? str : str.replace(/\.?0*$/, "");
}, exports.ucfirst = function(text) {
    return text ? text[0].toUpperCase() + text.substr(1) : text;
}, exports.crossFade = function(from, to, duration, callback) {
    from && from.animate({
        opacity: 0,
        duration: duration
    }), to && to.animate({
        opacity: 1,
        duration: duration
    }), callback && setTimeout(callback, duration + 300);
}, exports.fadeAndRemove = function(from, duration, container) {
    from && container && from.animate({
        opacity: 0,
        duration: duration
    }, function() {
        container.remove(from), container = from = duration = null;
    });
}, exports.fadeIn = function(to, duration) {
    to && to.animate({
        opacity: 1,
        duration: duration
    });
}, exports.popIn = function(view) {
    if (!require("data/settings").allowAnimations()) {
        view.transform = Ti.UI.create2DMatrix(), view.opacity = 1;
        return;
    }
    var animate1 = Ti.UI.createAnimation({
        opacity: 1,
        transform: Ti.UI.create2DMatrix().scale(1.05, 1.05),
        duration: 200
    }), animate2 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix(),
        duration: 300
    });
    exports.chainAnimate(view, [ animate1, animate2 ]), view = null;
}, exports.shake = function(view, delay) {
    var shake1 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(5, 0),
        duration: 100
    }), shake2 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(-5, 0),
        duration: 100
    }), shake3 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(5, 0),
        duration: 100
    }), shake4 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(-5, 0),
        duration: 100
    }), shake5 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix(),
        duration: 100
    });
    delay ? setTimeout(function() {
        exports.chainAnimate(view, [ shake1, shake2, shake3, shake4, shake5 ]), view = shake1 = shake2 = shake3 = shake4 = shake5 = null;
    }, delay) : exports.chainAnimate(view, [ shake1, shake2, shake3, shake4, shake5 ]);
}, exports.flash = function(view, delay) {
    var flash1 = Ti.UI.createAnimation({
        opacity: .7,
        duration: 100
    }), flash2 = Ti.UI.createAnimation({
        opacity: 1,
        duration: 100
    }), flash3 = Ti.UI.createAnimation({
        opacity: .7,
        duration: 100
    }), flash4 = Ti.UI.createAnimation({
        opacity: 1,
        duration: 100
    });
    delay ? setTimeout(function() {
        exports.chainAnimate(view, [ flash1, flash2, flash3, flash4 ]), view = flash1 = flash2 = flash3 = flash4 = null;
    }, delay) : exports.chainAnimate(view, [ flash1, flash2, flash3, flash4 ]);
}, exports.chainAnimate = function(view, animations) {
    function step() {
        if (animations.length == 0) {
            view = animations = null;
            return;
        }
        var animation = animations.shift();
        animation.addEventListener("complete", step), view.animate(animation);
    }
    step();
}, exports.def = function(dict, defs) {
    for (var key in defs) {
        if (!defs.hasOwnProperty(key)) continue;
        dict[key] === undefined && (dict[key] = defs[key]);
    }
}, exports.handleActionableTarget = function(evt) {
    if (!evt || !evt.source || evt.source.action === undefined || evt.source.target === undefined && evt.source.text === undefined) return;
    var action = evt.source.action, target = evt.source.target || evt.source.text, cleanTarget = target.split("\n").join(" ");
    cleanTarget.indexOf("http") == 0 && (action = ""), action != "tel://";
    var together = action + cleanTarget;
    if (!Ti.Platform.canOpenURL(together)) Ti.UI.Clipboard.setText(cleanTarget), Ti.UI.createAlertDialog({
        title: "Copied to Clipboard!",
        message: cleanTarget
    }).show(); else {
        var appName = "External Application";
        together.split("maps.google.com").length > 1 ? appName = "Google Maps" : together.split("http://").length > 1 ? appName = "Safari" : action == "tel://" ? appName = "Phone" : action == "mailto://" && (appName = "Mail"), exports.confirm({
            title: "Launching " + appName,
            message: "Are you sure?",
            callback: function() {
                Ti.Platform.openURL(action + cleanTarget), action = cleanTarget = null;
            }
        });
    }
    evt = null;
}, exports.confirm = function(args) {
    var alertDialog = Ti.UI.createAlertDialog({
        title: args.title || "Confirm",
        message: args.message || "Are you sure?",
        buttonNames: [ args.no || "No", args.yes || "Yes" ],
        cancel: 0
    });
    alertDialog.addEventListener("click", function(evt) {
        evt.index && args.callback && args.callback(args.evt || {}), args = null;
    }), alertDialog.show();
}, exports.stringToDate = function(str) {
    if (!str || str == "0000-00-00T00:00:00") return null;
    if (typeof str == "string") {
        var val = new Date(str.replace(/-/g, "/").replace(/[TZ]/g, " "));
        return val && val != "undefined" ? val : null;
    }
    return str;
}, exports.formatAsTime = function(time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime) return "";
    var aa = "AM", hours = date.getHours();
    hours >= 12 && (aa = "PM", hours -= 12), hours == 0 && (hours = "12");
    var minutes = date.getMinutes();
    return minutes < 10 && (minutes = "0" + minutes), hours + ":" + minutes + " " + aa;
}, exports.formatCurrency = function(amount) {
    if (exports.mobileweb) {
        var num = isNaN(amount) || amount === "" || amount === null ? 0 : amount;
        return "$" + parseFloat(num).toFixed(2);
    }
    return String.formatCurrency(amount);
}, exports.formatAsDayMonth = function(time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime) return "";
    var month = date.getMonth() + 1, day = date.getDate();
    return day < 10 && (day = "0" + day), month + "/" + day;
}, exports.formatAsDOWMonthDayYear = function(time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime) return "";
    var dow = getDayOfWeek(date), month = getMonth(date), day = date.getDate();
    switch (day) {
      case 31:
      case 21:
      case 1:
        day += "st";
        break;
      case 22:
      case 2:
        day += "nd";
        break;
      case 3:
        day += "rd";
        break;
      default:
        day += "th";
    }
    var year = date.getFullYear();
    return dow + " " + month + " " + day + ", " + year;
}, exports.formatAsShort = function(time) {
    var date = exports.stringToDate(time);
    if (!date || !date.getTime) return "";
    var today = new Date, yesterday = new Date;
    yesterday.setDate(today.getDate() - 1);
    var tomorrow = new Date;
    tomorrow.setDate(today.getDate() + 1);
    var diff = Math.abs(((new Date).getTime() - date.getTime()) / 1e3), day_diff = Math.floor(diff / 86400);
    if (isNaN(day_diff) || day_diff < 0) return;
    var day = "";
    return areDatesEqual(date, today) ? day = "Today" : areDatesEqual(date, yesterday) ? day = "Yesterday" : areDatesEqual(date, tomorrow) ? day = "Tomorrow" : day_diff < 7 ? day = getDayOfWeek(date) : day = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(), day;
};