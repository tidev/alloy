Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('window controller', function() {
		validateUiComponent($, 'leftButton', {
			api: 'Ti.UI.Button',
			style: {
				title: 'left',
				id: 'leftButton'
			}
		});

		validateUiComponent($, 'rightButton', {
			api: 'Ti.UI.Button',
			style: {
				title: 'right',
				id: 'rightButton'
			}
		});
	});
};