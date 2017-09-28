Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('bottom controller', function() {
		validateUiComponent($, 'bottom', {
			api: 'Ti.UI.View',
			style: {
				id: 'bottom'
			}
		});
	});

	describe('bottom controller', function() {
		validateUiComponent($, 'b', {
			api: 'Ti.UI.Button',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				title: 'Click me',
				bottom: 20,
				id: 'b'
			}
		});
	});
};