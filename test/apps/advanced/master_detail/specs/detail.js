Ti.include('/runtimeTester.js');

module.exports = function($, opts) {
	opts = opts || {};
	jasmine.currentEnv_ = null;

	// all labels in this controller use the same generic style
	var labelValidator = function(id) {
		return {
			api: '',
			style: {
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				color: "#000",
				left: 15,
				top: 10,
				font: {
					fontSize: "18dp",
					fontWeight: "normal"
				},
				textAlign: "left",
				id: id
			}
		};
	};

	addMatchers();

	describe('detail controller', function() {
		validateUiComponent($, 'detail', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: "#fff",
				layout: "vertical",
				id: "detail"
			}
		});

		if (OS_ANDROID) { validateUiComponent($, 'name', labelValidator('name')); }
		validateUiComponent($, 'height', labelValidator('height'));
		validateUiComponent($, 'weight', labelValidator('weight'));
		validateUiComponent($, 'age', labelValidator('age'));
		validateUiComponent($, 'record', labelValidator('record'));

		it('has proper text in UI', function() {
			var stats = opts.stats || {};

			if (OS_ANDROID) {
				expect($.name.text).toEqual('Name: ' + opts.name);
			} else {
				expect($.detail.title).toEqual(opts.name);
			}
			expect($.age.text).toEqual('Age: ' + stats.age);
			expect($.height.text).toEqual('Height: ' + stats.height);
			expect($.weight.text).toEqual('Weight: ' + stats.weight);
			expect($.record.text).toEqual('Record: ' + stats.record);
		});
	});

	launchTests();
};