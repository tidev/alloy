Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				id: 'index',
				backgroundColor: '#fff',
				exitOnClose: true,
				fullscreen: false
			}
		});

		validateUiComponent($, 'label', {
			api: 'Ti.UI.Label',
			style: {
				color: '#000',
				font: {
					fontSize: OS_MOBILEWEB ? '18px' : '18dp',
					fontWeight: 'bold'
				},
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				text: 'Hello, World!',
				id: 'label'
			}
		});

		it('#label can change text property', function() {
			var newtext = 'TEST TEXT';
			$.label.text = newtext;
			expect($.label.text).toEqual(newtext);
		});
	});

	launchTests();
};