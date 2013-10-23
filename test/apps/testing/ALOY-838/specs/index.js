Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				id: 'index',
				backgroundColor: '#fff'
			}
		});

		var os = OS_IOS ? 'ios' : Ti.Platform.name,
			env = ENV_TEST ? 'test' : 'development';

		validateUiComponent($, 'button', {
			api: 'Ti.UI.Button',
			style: {
				title: "os:" + os + ' env:' + env,
				osOnly: os,
				envOnly: env,
				id: "button"
			}
		});
	});

	launchTests();
};