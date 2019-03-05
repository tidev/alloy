// Need to set initial apiName and classes manually on $.labelNoAutoStyle
// because, by default, autoStyle is not enabled
$.labelNoAutoStyle.apiName = 'Label';
$.labelNoAutoStyle.classes = ['blueshadow'];

var labels = [
	{
		label: $.labelNoAutoStyle,
		classes: ['huge']
	},
	{
		label: $.labelAutoStyle,
		classes: ['huge']
	},
	{
		label: $.UI.create('Label', {
			classes: ['tiny'],
			text: '["tiny"]'
		}),
		classes: ['right', 'greyBg']
	},
	{
		label: $.UI.create('Label', {
			classes: ['red'],
			text: '["red"]'
		}),
		classes: ['left', 'blueshadow']
	},
	{
		label: Ti.UI.createLabel({
			text: '[]',
			apiName: 'Label'
		}),
		classes: ['bigspace', 'red', 'huge']
	}
];

_.each(labels, function(o, index) {
	var label = o.label,
		classes = o.classes;

	label.addEventListener('click', function(e) {
		label._wasClicked = typeof label._wasClicked === 'undefined' ?
			false : !label._wasClicked;
		if (label._wasClicked) {
			Ti.API.info('remove: ' + JSON.stringify(classes) + ' from ' +
				JSON.stringify(label.classes));
			$.removeClass(label, classes);
		} else {
			Ti.API.info('add: ' + JSON.stringify(classes) + ' to ' +
				JSON.stringify(label.classes));
			$.addClass(label, classes);
		}
		label.text = JSON.stringify(label.classes);
	});
	if (index > 1) {
		$.index.add(label);
	}
});

$.index.open();

try {
	$.tester = $.UI.create('Label');
	require('specs/index')($);
} catch (e) {
	Ti.API.warn('No unit tests found for controller "index"');
}