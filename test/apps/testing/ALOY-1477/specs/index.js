Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {

		it('creates a model and does not error', function() {
			var t = function() {
				$.createModel();
			};
			expect(t).not.toThrow();
		});
	});

	launchTests();
};
