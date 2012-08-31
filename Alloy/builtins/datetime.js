/** 
 * @class Alloy.builtins.datetime
 * Collection of Date and Time utilities
 */

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

    var dow = exports.getDayOfWeek(date);
    var month = exports.getMonth(date);
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
    if (exports.areDatesEqual(date, today)) {
        day = 'Today';
    }
    else if (exports.areDatesEqual(date, yesterday)) {
        day = 'Yesterday';
    }
    else if (exports.areDatesEqual(date, tomorrow)) {
        day = 'Tomorrow';
    }
    else if (day_diff < 7) {
        day = exports.getDayOfWeek(date);
    }
    else {
        day = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    return day; // + ' @' + exports.getTime(date);
};

exports.getMonth = function(date) {
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

exports.getDayOfWeek = function(date) {
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

exports.getTime = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var period = hours > 11 ? 'pm' : 'am';
    if (hours > 12) { hours = hours - 12; }
    if (hours == 0) { hours = 12; }
    minutes = String(minutes).length == 1 ? '0' + String(minutes) : minutes;
    return hours + ':' + minutes + period;
}

exports.areDatesEqual = function(date1, date2) {
    return (date1.getMonth() + '/' + date1.getDate() + '/' + date1.getFullYear()) ===
        (date2.getMonth() + '/' + date2.getDate() + '/' + date2.getFullYear());
}
