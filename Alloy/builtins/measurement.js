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
 *     console.log('----- iOS -----');
 *     Ti.API.info('Ti.Platform.displayCaps.density: ' + Ti.Platform.displayCaps.density);
 *     Ti.API.info('Ti.Platform.displayCaps.dpi: ' + Ti.Platform.displayCaps.dpi);
 *     Ti.API.info('Ti.Platform.displayCaps.platformHeight: ' + Ti.Platform.displayCaps.platformHeight);
 *     Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
 *     if (Ti.Platform.osname === 'android'){
 *         Ti.API.info('Ti.Platform.displayCaps.xdpi: ' + Ti.Platform.displayCaps.xdpi);
 *         Ti.API.info('Ti.Platform.displayCaps.ydpi: ' + Ti.Platform.displayCaps.ydpi);
 *         Ti.API.info('Ti.Platform.displayCaps.logicalDensityFactor: ' + Ti.Platform.displayCaps.logicalDensityFactor);
 *     }
 *     console.log('dpToPX: ' + measurement.dpToPX(130));
 *     console.log('dpToSystem: ' + measurement.dpToSystem(130));
 *     console.log('pxToDP: ' + measurement.pxToDP(130));
 *     console.log('pxToSystem: ' + measurement.pxToSystem(130));
 *     console.log('systemToPX: ' + measurement.systemToPX(130));
 *     console.log('systemToDP: ' + measurement.systemToDP(130));
 *     console.log('convertUnitToPX: ' + measurement.convertUnitToPX('130dp'));
 *     console.log('convertUnitToDP: ' + measurement.convertUnitToDP('130dp'));
 *     console.log('convertUnitToSystem: ' + measurement.convertUnitToSystem('130dp'));
 *     console.log('-----');
 *
 * result sample:
 *
 *     [INFO] :   ----- iPhone OS -----
 *     [INFO] :   Ti.Platform.displayCaps.density: high
 *     [INFO] :   Ti.Platform.displayCaps.dpi: 320
 *     [INFO] :   Ti.Platform.displayCaps.platformHeight: 568
 *     [INFO] :   Ti.Platform.displayCaps.platformWidth: 320
 *     [INFO] :   dpToPX: 260
 *     [INFO] :   dpToSystem: 130
 *     [INFO] :   pxToDP: 65
 *     [INFO] :   pxToSystem: 65
 *     [INFO] :   systemToPX: 260
 *     [INFO] :   systemToDP: 130
 *     [INFO] :   convertUnitToPX: 260
 *     [INFO] :   convertUnitToDP: 130
 *     [INFO] :   convertUnitToSystem: 130
 *     [INFO] :   -----
 *     [INFO] :   ----- android -----
 *     [INFO] :   Ti.Platform.displayCaps.density: xhigh
 *     [INFO] :   Ti.Platform.displayCaps.dpi: 320
 *     [INFO] :   Ti.Platform.displayCaps.platformHeight: 1280
 *     [INFO] :   Ti.Platform.displayCaps.platformWidth: 720
 *     [INFO] :   Ti.Platform.displayCaps.xdpi: 345.0566101074219
 *     [INFO] :   Ti.Platform.displayCaps.ydpi: 342.2315673828125
 *     [INFO] :   Ti.Platform.displayCaps.logicalDensityFactor: 2
 *     [INFO] :   dpToPX: 260
 *     [INFO] :   dpToSystem: 260
 *     [INFO] :   pxToDP: 65
 *     [INFO] :   pxToSystem: 130
 *     [INFO] :   systemToPX: 130
 *     [INFO] :   systemToDP: 65
 *     [INFO] :   convertUnitToPX: 260
 *     [INFO] :   convertUnitToDP: 130
 *     [INFO] :   convertUnitToSystem: 260
 *     [INFO] :   -----
 */

var currentUnit = Ti.App.Properties.getString('ti.ui.defaultunit', 'system');
currentUnit = (currentUnit === 'system') ? (OS_IOS) ? Ti.UI.UNIT_DIP : Ti.UI.UNIT_PX : currentUnit;

function convert(val, fromUnit, toUnit) {
	return Ti.UI.convertUnits('' + parseInt(val) + fromUnit, toUnit);
}

module.exports = exports = {
	dpToPX: function(val) {
		return convert(val, Ti.UI.UNIT_DIP, Ti.UI.UNIT_PX);
	},
	dpToSystem: function(val) {
		return convert(val, Ti.UI.UNIT_DIP, currentUnit);
	},
	pxToDP: function(val) {
		return convert(val, Ti.UI.UNIT_PX, Ti.UI.UNIT_DIP);
	},
	pxToSystem: function(val) {
		return convert(val, Ti.UI.UNIT_PX, currentUnit);
	},
	systemToPX: function(val) {
		return convert(val, currentUnit, Ti.UI.UNIT_PX);
	},
	systemToDP: function(val) {
		return convert(val, currentUnit, Ti.UI.UNIT_DIP);
	},
	convertUnitToPX: function(valStr) {
		return Ti.UI.convertUnits(valStr, Ti.UI.UNIT_PX);
	},
	convertUnitToDP: function(valStr) {
		return Ti.UI.convertUnits(valStr, Ti.UI.UNIT_DIP);
	},
	convertUnitToSystem: function(valStr) {
		return Ti.UI.convertUnits(valStr, currentUnit);
	},
	pointPXToDP: function(pt) {
		return {
			x: this.pxToDP(pt.x),
			y: this.pxToDP(pt.y)
		};
	}
};
