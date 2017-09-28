Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				id: 'index'
			}
		});

		validateUiComponent($, 'mover', {
			api: 'Ti.UI.View',
			style: {
				backgroundColor: '#a00',
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				top: '20dp',
				id: 'mover'
			}
		});

		validateUiComponent($, 'label', {
			api: 'Ti.UI.Label',
			style: {
				color: '#eee',
				font: {
					fontSize: OS_MOBILEWEB ? '28px' : '28dp',
					fontWeight: 'bold'
				},
				text: 'Trimmable String',
				id: 'label'
			}
		});

		validateUiComponent($, 'shake', {
			api: 'Ti.UI.Button',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				color: '#000',
				top: '20dp',
				title: 'Shake',
				id: 'shake'
			}
		});

		validateUiComponent($, 'flash', {
			api: 'Ti.UI.Button',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				color: '#000',
				top: '20dp',
				title: 'Flash',
				id: 'flash'
			}
		});

		validateUiComponent($, 'trim', {
			api: 'Ti.UI.Button',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				top: '20dp',
				title: 'Trim',
				id: 'trim'
			}
		});
	});

	launchTests();
};