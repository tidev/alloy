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

		var os = OS_IOS ? 'ios' : Ti.Platform.name;

		validateUiComponent($, 'b', {
			api: 'Ti.UI.Button',
			style: {
				width: "50%",
				height: Ti.UI.SIZE,
				randomProp: "OK",
				mainConfig: "main:" + os,
				bothConfig: "theme:" + os,
				themeConfig: "theme:" + os,
				title: "click me",
				id: "b"
			}
		});
	});

	launchTests();
};