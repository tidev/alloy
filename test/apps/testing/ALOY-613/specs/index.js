Ti.include('/runtimeTester.js');

var labelStyle = {
	color: '#111',
	height: Ti.UI.SIZE,
	width: Ti.UI.SIZE,
	font: {
		fontSize: OS_MOBILEWEB ? '24px' : '24dp',
		fontWeight: 'bold'
	},
	right: OS_MOBILEWEB ? undefined : null,
	left: OS_MOBILEWEB ? undefined : null,
	bottom: OS_MOBILEWEB ? undefined : null
};

// TODO: Mobileweb represents null values differently. Remove mobileweb-specific 
// code when this is resolved: https://jira.appcelerator.org/browse/TIMOB-14295
module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'tester', {
			api: 'Ti.UI.Label',
			style: labelStyle
		});

		it('adds classes ["tiny","right"] to $.tester', function() {
			var t = function() {
				$.addClass($.tester, ['tiny','right']);
			};
			expect(t).not.toThrow();
		});

		validateUiComponent($, 'tester', {
			api: 'TI.UI.Label',
			style: _.extend(_.clone(labelStyle), {
				backgroundColor: '#efefef',
				font: {
					fontSize: OS_MOBILEWEB ? '10px' : '10dp',
					fontWeight: 'normal'
				},
				right: 0,
				apiName: 'Ti.UI.Label',
				classes: ['tiny','right']
			})
		}); 

		it('removes class "right" from $.tester', function() {
			var t = function() {
				$.removeClass($.tester, ['right']);
			};
			expect(t).not.toThrow();
		});

		validateUiComponent($, 'tester', {
			api: 'TI.UI.Label',
			style: _.extend(_.clone(labelStyle), {
				backgroundColor: '#efefef',
				font: {
					fontSize: OS_MOBILEWEB ? '10px' : '10dp',
					fontWeight: 'normal'
				},
				apiName: 'Ti.UI.Label',
				classes: ['tiny']
			})
		});

		it('removes class "tiny" from $.tester', function() {
			var t = function() {
				$.removeClass($.tester, ['tiny']);
			};
			expect(t).not.toThrow();
		});

		validateUiComponent($, 'tester', {
			api: 'TI.UI.Label',
			style: _.extend(_.clone(labelStyle), {
				apiName: 'Ti.UI.Label',
				classes: []
			})
		});

		it('adds classes "tiny right" via string to $.tester', function() {
			var t = function() {
				$.addClass($.tester, 'tiny right');
			};
			expect(t).not.toThrow();
		});

		validateUiComponent($, 'tester', {
			api: 'TI.UI.Label',
			style: _.extend(_.clone(labelStyle), {
				backgroundColor: '#efefef',
				font: {
					fontSize: OS_MOBILEWEB ? '10px' : '10dp',
					fontWeight: 'normal'
				},
				right: 0,
				apiName: 'Ti.UI.Label',
				classes: ['tiny','right']
			})
		}); 

		it('removes classes "tiny right" via string to $.tester', function() {
			var t = function() {
				$.removeClass($.tester, 'tiny right');
			};
			expect(t).not.toThrow();
		});

		validateUiComponent($, 'tester', {
			api: 'TI.UI.Label',
			style: _.extend(_.clone(labelStyle), {
				apiName: 'Ti.UI.Label',
				classes: []
			})
		});
	});

	launchTests();
};