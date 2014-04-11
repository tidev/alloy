Ti.include('/runtimeTester.js');

var CFG = require('alloy/CFG');
var CONST = require('alloy/constants');
var autoStyle = CFG[CONST.AUTOSTYLE_PROPERTY];

module.exports = function($) {
	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				id: 'index',
				backgroundColor: '#eee',
				exitOnClose: true,
				fullscreen: false,
				layout: 'vertical'
			}
		});

		validateUiComponent($, 'label', {
			api: 'Ti.UI.Label',
			style: {
				color: "#a00",
				font: {
					fontSize: OS_MOBILEWEB ? "48px" : "48dp",
					fontWeight: "bold"
				},
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				text: "some text",
				id: "label",
				shadowColor: '#999',
				shadowOffset: {
					x: 3,
					y: 3
				}
			}
		});

		if (autoStyle) {
			it('has #index, which has "classes" property', function() {
				expect($.index.classes).toContainSameAs([]);
			});
		} else {
			it('has #index, which has undefined "classes" property', function() {
				expect($.index.classes).toBeUndefined();
			});
		}

		if (autoStyle) {
			it('has #index, which has "apiName" property', function() {
				expect($.index.apiName).toEqual('Ti.UI.Window');
			});
		}

		if (autoStyle) {
			it('has #label, which has "classes" property', function() {
				expect($.label.classes).toContainSameAs(['main','shadow']);
			});
		} else {
			it('has #label, which has undefined "classes" property', function() {
				expect($.label.classes).toBeUndefined();
			});
		}

		if (autoStyle) {
			it('has #label, which has "apiName" property', function() {
				expect($.label.apiName).toEqual('Ti.UI.Label');
			});
		}
	});

	launchTests();
};