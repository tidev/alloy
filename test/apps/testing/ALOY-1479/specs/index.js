Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {

		it('should not throw exceptions', function() {
			var t = function() {
				$.init();
			};
			expect(t).not.toThrow();
		});
	});

	launchTests();
};
