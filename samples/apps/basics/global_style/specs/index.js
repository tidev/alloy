Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: '#fff',
				id: 'index'
			}
		});
	});

	launchTests();
};