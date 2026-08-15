/**
 * @class Alloy.builtins.dayjs
 * Day.js is a freely distributable, third-party JavaScript date library
 * for parsing, validating, manipulating, and formatting dates. It offers
 * a largely Moment.js-compatible API at a fraction of the size, but note
 * that Day.js objects are immutable and many features are shipped as
 * optional plugins.
 *
 * To use the Day.js library in Alloy,
 * require it with the `alloy` root directory in your `require` call. For example:
 *
 *     var dayjs = require('/alloy/dayjs');
 *     Ti.API.info('Date: ' + dayjs().format('dddd, MMMM D YYYY, h:mm:ss a')); // --> Monday, December 25 1995, 12:00:00 am
 *
 * Optional features are provided as plugins, which need to be required and
 * registered with `dayjs.extend()` before use:
 *
 *     var dayjs = require('/alloy/dayjs');
 *     dayjs.extend(require('/alloy/dayjs/plugin/relativeTime'));
 *     dayjs.extend(require('/alloy/dayjs/plugin/customParseFormat'));
 *     var day = dayjs('12-25-1995', 'MM-DD-YYYY');
 *     Ti.API.info(day.fromNow());
 *
 * To change the locale globally, require the locale file and call the dayjs.locale() function,
 * passing it the new language code. Locale files for the languages found in your project's
 * "i18n" folder are included automatically; any other locale needs an explicit `require()`.
 *
 *     var dayjs = require('/alloy/dayjs');
 *     require('/alloy/dayjs/locale/de');
 *     require('/alloy/dayjs/locale/fr');
 *     dayjs.locale('de');
 *
 * For documentation, usage examples and more information, see [https://day.js.org/](https://day.js.org).
 */
