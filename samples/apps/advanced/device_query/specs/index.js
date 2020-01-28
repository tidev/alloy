Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		var bgColor = '#000';
		if (OS_ANDROID) {
			bgColor = '#0f0';
		} else if (OS_IOS) {
			bgColor = '#f00';
		}

		validateUiComponent($, 'win', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: bgColor,
				id: 'win'
			}
		});
	});

	describe('index controller', function() {
		var text = 'Generic';
		var color = '#fff';

		if (OS_ANDROID) {
			text = 'Android' + (Alloy.isTablet ? '\nTablet' : '');
			color = '#000';
		} else if (OS_IOS) {
			text = Alloy.isTablet ? 'iPad' : 'iPhone';
		} else if (OS_WINDOWS) {
			text = 'Windows';
		}

		validateUiComponent($, 'osLabel', {
			api: 'Ti.UI.Label',
			style: {
				color: color,
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				textAlign: 'center',
				font: {
					fontSize: Alloy.isTablet ? 96 : 48,
					fontWeight: 'bold'
				},
				text: text,
				id: 'osLabel'
			}
		});
	});

	launchTests();
};
