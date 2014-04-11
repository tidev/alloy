Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {

		it('should return themed strings using L()', function() {
			expect(L('hello_world')).toEqual('Hello ALOY-858!');
		});

		it('should find a themed asset', function() {
			expect('/images/a.png').toBeFile();
		});
	});

	launchTests();
};