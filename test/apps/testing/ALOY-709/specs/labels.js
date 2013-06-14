Ti.include('/runtimeTester.js');

var CFG = require('alloy/CFG');
var CONST = require('alloy/constants');
var autoStyle = CFG[CONST.AUTOSTYLE_PROPERTY];

module.exports = function($) {
	addMatchers();

	describe('labels controller', function() {
		validateUiComponent($, 'labels', {
			api: 'Ti.UI.View',
			style: _.extend({
				backgroundColor: "#fcc",
		        height: Ti.UI.SIZE,
		        layout: "vertical",
		        id: "labels"
			}, autoStyle ? {apiName:'Ti.UI.View'} : {})
		});

		for (var i = 0; i < 3; i++) {
			var id = '__alloyId' + (i+3);
			validateUiComponent($, id, {
				api: 'Ti.UI.Label',
				style: _.extend({
					color: "#000",
			        height: Ti.UI.SIZE,
			        width: Ti.UI.SIZE,
			        top: 15,
			        backgroundColor: "#ccf",
			        text: "label " + (i+1),
			        id: id
				}, autoStyle || i === 1 ? {
					apiName: "Ti.UI.Label", 
					classes: [ "someClass" ]
				} : {})
			});
		}
	});
};