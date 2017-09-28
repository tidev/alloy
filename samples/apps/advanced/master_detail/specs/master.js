Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('master controller', function() {
		validateUiComponent($, 'master', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: '#fff',
				title: 'Boxers',
				id: 'master'
			}
		});

		validateUiComponent($, 'table', {
			api: 'Ti.UI.TableView',
			style: {
				id: 'table'
			}
		});
	});
};