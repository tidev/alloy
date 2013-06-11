function addLabels(e) {
	$.scroller.add(Ti.UI.createLabel(Alloy.createStyle('index', {
		apiName: 'Ti.UI.Label',
		text: 'Alloy.createStyle() + Ti.UI.createLabel()'
	})));

	$.scroller.add(Ti.UI.createLabel($.createStyle({
		apiName: 'Ti.UI.Label',
		text: '$.createStyle() + Ti.UI.createLabel()'
	})));

	$.scroller.add(Alloy.UI.create('index', 'Ti.UI.Label', {
		text: 'Alloy.UI.create()'
	}));

	$.scroller.add($.UI.create('Ti.UI.Label', {
		text: '$.UI.create()'
	}));

	$.scroller.add(Alloy.createWidget('alloy.testWidget', 'labelmaker').createLabels());
}

$.index.open();