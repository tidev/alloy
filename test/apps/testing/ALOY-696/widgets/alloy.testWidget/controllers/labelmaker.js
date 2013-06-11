exports.createLabels = function() {
	var container = $.UI.create('View', {
		classes: 'container'
	});
	container.add(Ti.UI.createLabel(Alloy.createStyle(
		{
			widgetId: 'alloy.testWidget',
			name: 'labelmaker'
		}, 
		{
			apiName: 'Ti.UI.Label',
			text: 'Alloy.createStyle() + Ti.UI.createLabel()'
		}
	)));

	container.add(Ti.UI.createLabel($.createStyle({
		apiName: 'Ti.UI.Label',
		text: '$.createStyle() + Ti.UI.createLabel()'
	})));

	container.add(Alloy.UI.create(
		{
			widgetId: 'alloy.testWidget',
			name: 'labelmaker'
		}, 
		'Ti.UI.Label', 
		{
			text: 'Alloy.UI.create()'
		}
	));

	container.add($.UI.create('Ti.UI.Label', {
		text: '$.UI.create()'
	}));

	return container;
}