Ti.include('/runtimeTester.js');

module.exports = function($, opts) {
	opts = opts || {};
	jasmine.currentEnv_ = null;
	addMatchers();

	var styler = {};
	if (OS_ANDROID) {
		styler = {
			mainView: {
				backgroundImage: '/bg_blue.png',
				borderColor: '#383838'
			},
			progressBack: {
				backgroundColor: '#ddd'
			},
			progressFront: {
				backgroundImage: '/title_gray.png'
			},
			button: {
				backgroundImage: '/button_dark.png',
				color: '#fff'
			}
		};
	} else if (OS_IOS) {
		styler = {
			cover: {
				backgroundColor: '#050'
			},
			mainView: {
				backgroundImage: '/bg_tan.png',
				borderColor: '#3da22f'
			},
			patienceLabel: {
				color: '#000'
			},
			progressBack: {
				backgroundColor: '#333',
				borderRadius: 16
			},
			progressFront: {
				backgroundImage: '/title_green.png',
				borderRadius: 16
			},
			button: {
				backgroundImage: '/button_green.png'
			}
		};
	} else if (OS_MOBILEWEB) {
		styler = {
			mainView: {
				backgroundImage: '/bg_gray.png',
				borderColor: '#1e99fd'
			},
			progressBack: {
				backgroundColor: '#333'
			},
			progressFront: {
				backgroundImage: '/title_blue.png'
			},
			button: {
				backgroundImage: '/button_blue.png',
				color: '#fff'
			}
		};
	}

	$.__styler = styler;

	describe('dialog controller', function() {
		validateUiComponent($, 'dialog', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: 'transparent',
				id: 'dialog'
			}
		});

		validateUiComponent($, 'cover', {
			api: 'Ti.UI.View',
			style: {
				backgroundColor: '#000',
				opacity: 0.65,
				id: 'cover'
			}
		});

		validateUiComponent($, 'mainView', {
			api: 'Ti.UI.View',
			style: {
				height: 155,
				width: '85%',
				borderWidth: 2,
				borderRadius: 8,
				backgroundColor: '#fff',
				id: 'mainView',
				layout: 'vertical'
			}
		});

		validateUiComponent($, 'patienceLabel', {
			api: 'Ti.UI.Label',
			style: {
				color: '#fff',
				top: 10,
				text: 'Testing your patience...',
				id: 'patienceLabel'
			}
		});

		validateUiComponent($, 'progressBack', {
			api: 'Ti.UI.View',
			style: {
				width: 200,
				height: 30,
				top: 15,
				id: 'progressBack'
			}
		});

		validateUiComponent($, 'progressFront', {
			api: 'Ti.UI.View',
			style: {
				width: 20,
				left: 1,
				top: 1,
				height: 28,
				backgroundColor: '#00f',
				id: 'progressFront'
			}
		});

		validateUiComponent($, 'button', {
			api: 'Ti.UI.Button',
			style: {
				top: 15,
				height: 50,
				width: 120,
				title: 'I quit!',
				id: 'button'
			}
		});
	});

	launchTests();
};