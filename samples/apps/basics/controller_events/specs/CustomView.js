Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('CustomView controller', function() {
		validateUiComponent($, 'CustomView', {
			api: 'Ti.UI.View',
			style: {
				layout: 'vertical',
				height: '300',
				backgroundColor: 'blue',
				id: 'CustomView'
			}
		});

		validateUiComponent($, 'text', {
			api: 'Ti.UI.TextField',
			style: {
				borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
				id: 'text',
				top: '10',
				height: '44',
				width: '250'
			}
		});

		validateUiComponent($, 'btn', {
			api: 'Ti.UI.Button',
			style: {
				title: 'Fire Event',
				id: 'btn',
				top: '10',
				height: '44',
				width: '250'
			}
		});
	});
};