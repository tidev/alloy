Ti.include('/runtimeTester.js');

module.exports = function($) {
	addMatchers();

	describe('buttons controller', function() {
		for (var i = 0; i < 3; i++) {
			var id = 'button' + (i+1);
			validateUiComponent($, id, {
				api: 'Ti.UI.Button',
				style: _.extend({
					title: 'button ' + (i+1),
			        id: id
				}, i !== 2 ? {
					apiName: "Ti.UI.Button", 
					classes: [ "bob", "lou" ]
				} : {})
			});
		}

		it('has #button3, which has no apiName or classes', function() {
			expect($.button3.apiName).toBeUndefined();
			expect($.button3.classes).toBeUndefined();
		});
	});
};