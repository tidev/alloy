Ti.include('/runtimeTester.js');
var Validator = require('validator.js/dist/validator');

module.exports = function($) {
	describe('index controller', function() {
		it('#label can use a module required from a directory ending with .js', function() {
			var values = {
				a: 12,
				b: 'Some string',
				c: null
			};
			var validators = {
				a: [
					new Validator.Assert().GreaterThan(0),
					new Validator.Assert().LessThan(80)
				],
				b: [
					new Validator.Assert().NotNull()
				],
				c: [
					new Validator.Assert().Null()
				]
			};
			expect(new Validator.Validator().validate(values, validators)).toEqual(true);

			validators.c = [
				new Validator.Assert().NotNull()
			];
			expect(new Validator.Validator().validate(values, validators)).not.toEqual(true);

		});
	});

	launchTests();
};
