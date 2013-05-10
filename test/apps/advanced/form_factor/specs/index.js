Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		var bgColor = '#000';
		if (OS_ANDROID) {
			bgColor = '#0f0';
		} else if (OS_IOS) {
			bgColor = '#f00';
		} else if (OS_MOBILEWEB) {
			bgColor = '#00f';
		} else if (OS_BLACKBERRY) {
			bgColor = '#0ff';
		}

		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: '#fff',
        		id: "index"
			}
		});

		validateUiComponent($, 'main', {
			api: 'Ti.UI.View',
			style: {
				backgroundColor: Alloy.isTablet ? 'red' : 'blue',
        		id: "main"
			}
		});

		validateUiComponent($, 'label', {
			api: 'Ti.UI.Label',
			style: {
				width: Ti.UI.SIZE,
	            height: Ti.UI.SIZE,
	            color: "#fff",
	            text: Alloy.isTablet ? "I'm a tablet!" : "I'm a handheld!",
	            id: "label"
			}
		});

		validateUiComponent($, 'container', {
			api: 'Ti.UI.View',
			style: {
				id: "container",
	            height: "50",
	            width: "200",
	            bottom: "10",
	            backgroundColor: "#cdcdcd"
			}
		});

		validateUiComponent($, 'platformLabel', {
			api: 'Ti.UI.Label',
			style: {
				width: Ti.UI.SIZE,
	            height: Ti.UI.SIZE,
	            color: "#fff",
	            text: Ti.Platform.osname + (OS_IOS ? '' : ' ' + (Alloy.isTablet ? 'tablet' : 'handheld')),
	            id: "platformLabel"
			}
		});
	});

	launchTests();
};