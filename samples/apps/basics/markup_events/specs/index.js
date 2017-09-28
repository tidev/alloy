Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: 'white',
				id: 'index'
			}
		});
	});

	describe('index controller', function() {
		validateUiComponent($, 't', {
			api: 'Ti.UI.Label',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				color: '#900',
				id: 't',
				text: 'CLICK ME'
			}
		});
	});

	launchTests();
};