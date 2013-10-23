Ti.include('/runtimeTester.js');

var measure = require('alloy/measurement');

var BASE_MEASURE = 100,
	MULT = Ti.Platform.displayCaps.density === 'high' ? 2 : 1,
	RETINA_MEASURE = BASE_MEASURE * MULT,
	RETINA_HALF_MEASURE = BASE_MEASURE / MULT,
	dpi = Ti.Platform.displayCaps.dpi;

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {

		it('should convert units with dpToPX()', function() {

			var val = measure.dpToPX(BASE_MEASURE);

			if (OS_ANDROID) {
				expect(val).toEqual(BASE_MEASURE * dpi / 160);
			} else if (OS_IOS) {
				expect(val).toEqual(RETINA_MEASURE);
			} else {
				expect(val).toEqual(BASE_MEASURE);
			}

		});

		it('should convert units with pxToDP()', function() {

			var val = measure.pxToDP(BASE_MEASURE);

			if (OS_ANDROID) {
				expect(val).toEqual(BASE_MEASURE / dpi * 160);
			} else if (OS_IOS) {
				expect(val).toEqual(RETINA_HALF_MEASURE);
			} else {
				expect(val).toEqual(BASE_MEASURE);
			}

		});

		it('should convert units with pointPXToDP()', function() {

			var val = measure.pointPXToDP({ x:BASE_MEASURE, y:BASE_MEASURE });

			if (OS_ANDROID) {
				expect(val).toEqual({ x:BASE_MEASURE / dpi * 160, y:BASE_MEASURE / dpi * 160 });
			} else if (OS_IOS) {
				expect(val).toEqual({ x:RETINA_HALF_MEASURE, y:RETINA_HALF_MEASURE });
			} else {
				expect(val).toEqual({ x:BASE_MEASURE, y:BASE_MEASURE });
			}

		});
	});

	launchTests();
};