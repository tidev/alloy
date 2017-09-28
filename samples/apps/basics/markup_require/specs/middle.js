Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('middle controller', function() {
		validateUiComponent($, 'middle', {
			api: 'Ti.UI.View',
			style: {
				backgroundColor: 'red',
				height: Ti.UI.SIZE,
				width: Ti.UI.FILL,
				id: 'middle'
			}
		});
	});

	describe('middle controller', function() {
		validateUiComponent($, 't', {
			api: 'Ti.UI.Label',
			style: {
				color: 'yellow',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				text: 'Middle',
				id: 't'
			}
		});
	});
};