Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				layout: 'vertical',
				backgroundColor: 'white',
				id: 'index'
			}
		});

		validateUiComponent($, 'remove', {
			api: 'Ti.UI.Button',
			style: {
				title: 'Remove Listener',
				id: 'remove',
				top: '10'
			}
		});
	});

	launchTests();
};