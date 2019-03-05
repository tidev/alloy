Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				id: 'index',
				backgroundColor: '#fff'
			}
		});

		validateUiComponent($, 'b', {
			api: 'Ti.UI.Button',
			style: {
				width: '50%',
				height: Ti.UI.SIZE,
				randomProp: 'OK',
				title: 'click me',
				id: 'b'
			}
		});
	});

	launchTests();
};