Ti.include('/runtimeTester.js');

module.exports = function($) {
	if (!OS_ANDROID && !OS_IOS) { return; }

	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: '#fff',
				fullscreen: false,
				exitOnClose: true,
				id: 'index'
			}
		});

		validateUiComponent($, 'paint', {
			style: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				strokeColor: '#0f0',
				strokeAlpha: 255,
				strokeWidth: 10,
				eraseMode: false,
				id: 'paint'
			}
		});
	});

	launchTests();
};