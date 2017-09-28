Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('item controller', function() {
		validateUiComponent($, 'item', {
			api: 'Ti.UI.View',
			style: {
				backgroundColor: '#00f',
				id: 'item'
			}
		});

		validateUiComponent($, 'label', {
			api: 'Ti.UI.Label',
			style: {
				color: '#f00',
				font: {
					fontSize: OS_MOBILEWEB ? '24px' : 24,
					fontWeight: 'bold'
				},
				textAlign: 'center',
				text: 'should be bold, red text on blue background',
				id: 'label'
			}
		});
	});
};