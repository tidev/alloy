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
		classes: ['right','greyBg']
	},
	{
		label: $.UI.create('Label', {
			classes: ['red'],
			text: '["red"]'
		}),
		classes: ['left','blueshadow']
	},
	{
		label: Ti.UI.createLabel({
			text: '[]',
			apiName: 'Label'
		}),
		classes: ['bigspace','red','huge']
	}
];

_.each(labels, function(o, index) {
	o.label.addEventListener('click', function(e) {
		e.source._wasClicked = typeof e.source._wasClicked === 'undefined' ?
			false : !e.source._wasClicked; 
		if (e.source._wasClicked) {
			Ti.API.info('remove: ' + JSON.stringify(o.classes));
			$.removeClass(e.source, o.classes);
		} else {
			Ti.API.info('add: ' + JSON.stringify(o.classes));
			$.addClass(e.source, o.classes);
		}
		e.source.text = JSON.stringify(e.source.classes);
	});
	if (index > 1) {
		$.index.add(o.label);
	}
});

$.index.open();