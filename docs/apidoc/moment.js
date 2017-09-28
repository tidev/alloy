/**
 * @class Alloy.builtins.moment
 * Moment.js is a freely distributable, third-party JavaScript date library
 * for parsing, validating, manipulating, and formatting dates.
 *
 * To use the moment.js library in Alloy,
 * require it with the `alloy` root directory in your `require` call. For example:
 *
 *     var moment = require('/alloy/moment');
 *     var day = moment("12-25-1995", "MM-DD-YYYY");
 *     Ti.API.info("Date:" + day.format("dddd, MMMM Do YYYY, h:mm:ss a")); // --> Monday, December 25th 1995, 12:00:00 am
 *
 * To change the locale globally, the application calls the moment.locale() function, passing it the new language code.
 *
 *     var moment = require('/alloy/moment');
 *     require('/alloy/moment/lang/de');
 *     require('/alloy/moment/lang/fr');
 *     moment.locale(Ti.Locale.currentLocale); // Set current system locale, as a combination of ISO 2-letter language and country codes.
 *
 * For documentation, usage examples and more information, see [http://momentjs.com/](http://momentjs.com).
 */
