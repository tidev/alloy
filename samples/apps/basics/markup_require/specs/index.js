Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: '#fff',
				layout: 'vertical',
				id: 'index'
			}
		});
	});

	describe('index controller', function() {
		validateUiComponent($, 'top', {
			api: 'Ti.UI.View',
			style: {
				backgroundColor: 'black',
				borderRadius: 2,
				borderColor: 'blue',
				height: 100,
				id: 'top'
			}
		});
	});

	launchTests();
};