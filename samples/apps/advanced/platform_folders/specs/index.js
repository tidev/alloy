Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: '#000',
				id: 'index'
			}
		});

		if (OS_IOS) {
			validateUiComponent($, 'coverflow', {
				api: 'Ti.UI.iOS.CoverFlowView',
				style: {
					backgroundColor: '#000',
					images: [ '/appc1.png', '/appc2.png', '/appc3.png', '/appc4.png' ],
					id: 'coverflow'
				}
			});

			validateUiComponent($, 'apilabel', {
				api: 'Ti.UI.Label',
				style: {
					color: '#fff',
					textAlign: 'center',
					font: {
						fontSize: 20,
						fontWeight: 'bold'
					},
					bottom: 10,
					height: Ti.UI.SIZE,
					width: Ti.UI.FILL,
					text: 'Ti.UI.iOS.CoverFlowView',
					id: 'apilabel'
				}
			});
		} else {
			validateUiComponent($, 'scroll', {
				api: 'Ti.UI.ScrollView',
				style: {
					layout: 'vertical',
					id: 'scroll'
				}
			});

			for (var i = 1; i <= 4; i++) {
				var id = '__alloyId' + i;
				validateUiComponent($, id, {
					api: 'Ti.UI.ImageView',
					style: {
						image: '/appc' + i + '.png',
						id: id
					}
				});
			}
		}
	});

	launchTests();
};