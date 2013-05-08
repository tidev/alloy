var j = require('jasmine'),
	CR = require('ConsoleReporter'),
	describe = j.describe,
	it = j.it,
	expect = j.expect,
	jasmine = j.jasmine;

module.exports = function($) {
	describe('index controller', function() {
		it('has an #index component', function() {
			expect($.index).toBeDefined();
			expect($.index).not.toBeNull();
		});

		it('#index component is a Ti.UI.Window', function() {
			expect(_.isFunction($.index.open)).toBeTruthy();
		});

		it('#index component has correct style', function() {
			expect($.index.backgroundColor).toEqual('#fff');
			expect($.index.exitOnClose).toEqual(true);
			expect($.index.fullscreen).toEqual(false);
			expect($.index.id).toEqual('index');
		});

		it('has an #label component', function() {
			expect($.label).toBeDefined();
			expect($.label).not.toBeNull();
		});

		it('#label component is a Ti.UI.Label', function() {
			expect($.label.text).toBeTruthy();
		});

		it('#label component has correct style', function() {
			expect($.label.color).toEqual('#000');
			expect($.label.font.fontSize).toEqual('18dp');
			expect($.label.font.fontWeight).toEqual('bold');
			expect($.label.height).toEqual(Ti.UI.SIZE);
			expect($.label.width).toEqual(Ti.UI.SIZE);
			expect($.label.text).toEqual('Hello, World!');
			expect($.label.id).toEqual('label');
		});

		it('#label can change text property', function() {
			var newtext = 'TEST TEXT';
			$.label.text = newtext;
			expect($.label.text).toEqual(newtext);
		});
	});

	jasmine.getEnv().addReporter(new CR({
		doneCallback: function(runner) {
			alert(runner.specs().length + ' specs, ' + runner.results().failedCount + ' failed');
		}
	}));
	jasmine.getEnv().execute();
};