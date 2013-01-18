/**
 * @class Alloy.builtins.datetime
 * A collection of utilities for manipulating Date objects.
 * To use the datetime builtin library,
 * require it with the `alloy` root directory in your `require` call. For example:
 *
 *		var datetime = require('alloy/datetime');
 *		var date = new Date('2012/08/31 13:44:45');
 *		Ti.API.info(datetime.formatAsDOWMonthDayYear(date)); // --> 'Friday August 31st, 2012'
 *		Ti.API.info(datetime.formatAsTime(date)); // --> '1:30 PM'
 *
 * @deprecated 0.3.4 Use Alloy.builtins.moment instead.
 */
exports.stringToDate = function (str) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
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

/**
 * @method formatAsTime
 * Converts a JavaScript Date object to a 12-hour time string in the format 'hh:mm' followed by
 * 'AM' or 'PM'.
 * @param {Date} time Date object to convert.
 * @return {String} Formatted time string.
 */
exports.formatAsTime = function (time) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
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

/**
 * @method formatDayMonth
 * Converts a JavaScript Date object to a date string in the format 'MM/DD'.
 * @param {Date} time Date object to convert.
 * @return {String} Formatted date string.
 */
exports.formatAsDayMonth = function (time) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
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

/**
 * @method formatAsDOWMonthDayYear
 * Converts a JavaScript Date object to a date string in the format 'Day_of_Week Month Ordinal_Day, Year'.
 * @param {Date} time Date object to convert.
 * @return {String} Formatted date string.
 */
exports.formatAsDOWMonthDayYear = function (time) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
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

/**
 * @method formatAsShort
 * Converts a JavaScript Date object to a string describing the date. Values can be 'Today',
 * 'Tomorrow', 'Yesterday', day of the week if it is within seven days of the current day
 * or the format 'MM/DD/YYYY' for all other cases.
 * @param {Date} time Date object to convert.
 * @return {String} Short string describing the date or in the format 'MM/DD/YYYY'.
 */
exports.formatAsShort = function (time) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
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

/**
 * @method formatAsRFC822
 * Converts a JavaScript Date object to a string in RFC822 format
 * For more information see: http://www.w3.org/Protocols/rfc822/#z28
 * @param {Date} time Date object to convert.
 * @param {Boolean} omitDOW If true, the day-of-week won't be included in the date (default false)
 * @return {String} Date formatted in RFC822 format.
 */
exports.formatAsRFC822 = function (time, omitDOW) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
    var date = exports.stringToDate(time);
    if (!date || !date.getTime)
        return '';

    var dow = exports.getDayOfWeek(date);
    var month = exports.getMonth(date);
    var day = date.getDate();
    if (day < 10)
        day = '0' + day;
    var year = date.getFullYear();

    var hours = date.getHours();
    if (hours < 10)
        hours = '0' + hours;
    var minutes = date.getMinutes();
    if (minutes < 10)
        minutes = '0' + minutes;
    var seconds = date.getSeconds();
    if (seconds < 10)
        seconds = '0' + seconds;

    var tz = date.getTimezoneOffset();
    var tzHours = Math.floor(tz/60);
    var tzMinutes = Math.abs(tz%60);

    var timezone = new String();
    timezone += (tzHours > 0) ? "-" : "+";
    var absHours = Math.abs(tzHours)
    timezone += (absHours < 10) ? "0" + absHours : absHours;
    timezone += ((tzMinutes == 0) ? "00" : tzMinutes);

    var dtm = new String();

    if (omitDOW != true)
        dtm = dow.substring(0, 3) + ", ";

    dtm += day + " ";
    dtm += month.substring(0, 3) + " ";
    dtm += year + " ";
    dtm += hours + ":";
    dtm += minutes + ":";
    dtm += seconds + " ";
    dtm += timezone;

    return dtm;
};

/**
 * @method getMonth
 * Retrieves the name of the month from the JavaScript Date object.
 * @param {Date} date Date object to use.
 * @return {String} Name of the month.
 */
exports.getMonth = function(date) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
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

/**
 * @method getDayOfWeek
 * Retrieves the day of the week from the JavaScript Date object.
 * @param {Date} date Date object to use.
 * @return {String} Day of the week.
 */
exports.getDayOfWeek = function(date) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
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

/**
 * @method getTime
 * Retrieves the 12-hour time from the JavaScript Date object.
 * @param {Date} date Date object to use.
 * @return {String} Time in the format 'hh:mm' followed by 'am' or 'pm'.
 */
exports.getTime = function(date) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var period = hours > 11 ? 'pm' : 'am';
    if (hours > 12) { hours = hours - 12; }
    if (hours == 0) { hours = 12; }
    minutes = String(minutes).length == 1 ? '0' + String(minutes) : minutes;
    return hours + ':' + minutes + period;
}

/**
 * @method areDatesEqual
 * Compares two Javascript Date objects.
 * @param {Date} date1 First date object to compare.
 * @param {Date} date2 Second date object to compare.
 * @return {Boolean} Returns 'true' if the two Date objects are the same else 'false'.
 */
exports.areDatesEqual = function(date1, date2) {
    Ti.API.warn('datetime.js builtin is deprecated and will be removed in Alloy 0.4.0.');
    Ti.API.warn('Use moment.js builtin instead for datetime manipulations.');
    return (date1.getMonth() + '/' + date1.getDate() + '/' + date1.getFullYear()) ===
        (date2.getMonth() + '/' + date2.getDate() + '/' + date2.getFullYear());
}
