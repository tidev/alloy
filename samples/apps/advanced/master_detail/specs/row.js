Ti.include('/runtimeTester.js');

module.exports = function($, opts) {
	addMatchers();

	describe('row controller', function() {
		validateUiComponent($, 'row', {
			api: 'Ti.UI.TableViewRow',
			style: {
				backgroundColor: '#fff',
				height: '60dp',
				id: 'row'
			}
		});

		validateUiComponent($, 'name', {
			api: 'Ti.UI.Label',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				color: '#000',
				top: '5dp',
				left: '10dp',
				font: {
					fontSize: OS_MOBILEWEB ? '24px' : '24dp',
					fontWeight: 'bold'
				},
				id: 'name'
			}
		});

		validateUiComponent($, 'nickname', {
			api: 'Ti.UI.Label',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				color: '#000',
				bottom: '5dp',
				left: '20dp',
				font: {
					fontSize: OS_MOBILEWEB ? '16px' : '16dp',
					fontWeight: 'normal'
				},
				id: 'nickname'
			}
		});

		it('properly adds name and nickname to UI', function() {
			expect($.name.text).toEqual(opts.name);
			expect($.nickname.text).toEqual(opts.nickname);
		});
	});
};