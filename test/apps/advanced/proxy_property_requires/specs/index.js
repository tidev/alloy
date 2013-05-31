Ti.include('/runtimeTester.js');

function validateTabTable($, title, opts) {
	opts || (opts = {});


	validateUiComponent($, title + 'Tab', {
		api: 'Ti.UI.Tab',
		style: {
			title: title,
			id: title + 'Tab'
		}
	});

	validateUiComponent($, title + 'Window', {
		api: 'Ti.UI.Window',
		style: {
			backgroundColor: "#fff",
	        title: opts.windowTitle || title,
	        id: title + "Window"
		} 
	});

	if (!opts.skipTable) {
		validateUiComponent($, title + 'Table', {
			api: 'Ti.UI.TableView',
			style: {
				id: title + 'Table'
			}
		});
	}
}

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.TabGroup',
			style: {
				id: "index"
			} 
		});

		validateTabTable($, 'static');

		for (var i = 1; i <= 3; i++) {
			var id = 'staticRow' + i;
			validateUiComponent($, id, {
				api: 'Ti.UI.TableViewRow',
				style: {
					height: "50dp",
			        id: id,
			        title: i + ''
				} 
			});	
		}

		it('#staticWidgetSection is a widget', function() {
			expect($.staticWidgetSection).toBeWidget();
		});

		for (i = 1; i <= 3; i++) {
			id = 'staticWidgetRow' + i;
			it('#' + id + ' is a widget', function() {
				expect($[id]).toBeWidget();
			});
		}
		
		validateTabTable($, 'binding');
		validateTabTable($, 'proxies', { windowTitle: 'proxy properties' });
		validateTabTable($, 'window', { skipTable: true });
		
	});

	launchTests();
};