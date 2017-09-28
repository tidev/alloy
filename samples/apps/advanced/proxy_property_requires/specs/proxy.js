Ti.include('/runtimeTester.js');

module.exports = function($) {
	//jasmine.currentEnv_ = null;

	addMatchers();

	describe('proxy controller', function() {
		if (OS_IOS) {
			validateUiComponent($, 'pullView', {
				api: 'Ti.UI.View',
				style: {
					height: '60dp',
					backgroundColor: '#aaa',
					id: 'pullView'
				}
			});

			validateUiComponent($, 'pullText', {
				api: 'Ti.UI.Label',
				style: {
					text: 'Something about refreshing would be here',
					id: 'pullText',
					height: Ti.UI.SIZE,
					width: Ti.UI.SIZE,
					bottom: 10
				}
			});
		}

		validateUiComponent($, 'headerView', {
			api: 'Ti.UI.View',
			style: {
				height: '60dp',
				backgroundColor: '#0f0',
				id: 'headerView'
			}
		});

		validateUiComponent($, 'headerText', {
			api: 'Ti.UI.Label',
			style: {
				text: "I'm an ugly headerView",
				id: 'headerText'
			}
		});

		validateUiComponent($, 'footerView', {
			api: 'Ti.UI.View',
			style: {
				height: '60dp',
				backgroundColor: '#0f0',
				id: 'footerView'
			}
		});

		validateUiComponent($, 'footerText', {
			api: 'Ti.UI.Label',
			style: {
				text: "I'm an equally ugly footerView",
				id: 'footerText'
			}
		});
	});
};
