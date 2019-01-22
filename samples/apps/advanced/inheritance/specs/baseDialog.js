Ti.include('/runtimeTester.js');

module.exports = function($, opts) {
	opts = opts || {};
	var isAnimated = (opts.message || '').indexOf('animated') !== -1;
	jasmine.currentEnv_ = null;

	addMatchers();

	describe('baseDialog controller', function() {
		validateUiComponent($, 'cover', {
			api: 'Ti.UI.View',
			style: {
				backgroundColor: '#000',
				opacity: isAnimated ? 0 : 0.5,
				height: Ti.UI.FILL,
				width: Ti.UI.FILL,
				id: 'cover'
			}
		});

		validateUiComponent($, 'dialog', {
			api: 'Ti.UI.View',
			style: {
				height: '100dp',
				width: '66%',
				backgroundColor: '#fff',
				borderColor: '#000',
				borderWidth: 2,
				borderRadius: 4,
				id: 'dialog'
			}
		});

		validateUiComponent($, 'message', {
			api: 'Ti.UI.Label',
			style: {
				color: '#000',
				left: 10,
				right: 10,
				top: 10,
				height: Ti.UI.SIZE,
				font: {
					fontSize: OS_MOBILEWEB ? '16px' : '16dp'
				},
				textAlign: 'center',
				text: opts.message,
				id: 'message'
			}
		});

		validateUiComponent($, 'closeButton', {
			api: 'Ti.UI.Button',
			style: {
				bottom: 10,
				title: 'Close Dialog',
				id: 'closeButton'
			}
		});
	});

	launchTests();
};