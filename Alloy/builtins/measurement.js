/**
 * @class Alloy.builtins.measurement
 * A collection of utilities for converting between different display units.
 * These functions are only useful on the Android platform to support devices with different
 * screen densities and resolutions.
 *
 * To use the measurement builtin library,
 * require it with the `alloy` root directory in your `require` call. For example:
 *
 *     var measurement = require('alloy/measurement');
 *     var pointPX = {x:42, y:7};
 *     var pointDP = measurement.pointPXToDP(pointPX);
 */

var dpi = Ti.Platform.displayCaps.dpi,
    density = Ti.Platform.displayCaps.density;

/**
 * @method dpToPX
 * Converts a density-independent pixel value to screen pixels.
 * @param {Number} val Value in density-independent pixels.
 * @return {Number} Converted value in screen pixels.
 */
exports.dpToPX = function (val) {
    if (OS_ANDROID) {
        return val * dpi / 160;
    } else if (OS_IOS) {
        return val * (density === 'high' ? 2 : 1);
    } else {
        return val;
    }
};

/**
 * @method pxToDP
 * Converts a screen pixel value to density-independent pixels.
 * @param {Number} val Value in screen pixels.
 * @return {Number} Converted value in density-independent pixels.
 */
exports.pxToDP = function (val) {
    if (OS_ANDROID) {
        return val / dpi * 160;
    } else if (OS_IOS) {
        return val / (density === 'high' ? 2 : 1);
    } else {
        return val;
    }
};

/**
 * @method pointPXToDP
 * Converts a coordinate (x, y) from screen pixels to density-independent pixels.
 * @param {Number} val Coordinate in screen pixels.
 * @return {Number} Converted coordinate in density-independent pixels.
 */
exports.pointPXToDP = function (pt) {
    if (OS_ANDROID || OS_IOS) {
        return { x: exports.pxToDP(pt.x), y: exports.pxToDP(pt.y) };
    } else {
        return pt;
    }
};
