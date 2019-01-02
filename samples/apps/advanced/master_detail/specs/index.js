Ti.include('/runtimeTester.js');

module.exports = function($) {
	if (!OS_IOS && !OS_ANDROID) {
		return;
	}

	addMatchers();

	describe('index controller', function() {
		if (OS_IOS && Alloy.isHandheld) {

			validateUiComponent($, 'index', {
				api: 'Ti.UI.iPhone.NavigationGroup',
				style: {
					id: 'index',
					backgroundColor: '#fff'
				}
			});
		}

		if (OS_IOS && Alloy.isTablet) {
			validateUiComponent($, 'index', {
				api: 'Ti.UI.iPad.createSplitWindow',
				style: {
					id: 'index'
				}
			});

			it('has an instance of "detail" controller', function() {
				expect($.detail).toBeController();
			});
		}

		it('has an instance of "master" controller', function() {
			expect($.master).toBeController();
		});
	});

	launchTests();
};