var childView = Alloy.createController('childview');
childView.updateViews({
	"#label": {
		text: 'I am a label',
		top: 50,
		width: Ti.UI.FILL,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		ellipsize: false,
		backgroundGradient: {
			type: 'linear',
			startPoint: { x: '0%', y: '50%' },
			endPoint: { x: '100%', y: '50%' },
			colors: [ { color: 'red', offset: 0.0}, { color: 'blue', offset: 0.25 }, { color: 'red', offset: 1.0 } ],
	}},
	"#anotherlabel": {
		text: 'I am also a label',
		foo: 'bar'
	},
	"#someNonExistentId": { text: 'I do not exist'},
	"#aRequiredView": {
		text: "I was <Require>d in but updateViews() won't work on me",
		bottom: 50
	}
});

$.index.add(childView.getView());

var opts = {
	'#normallabel': {
		text: 'i used updateViews()',
		color: '#a00',
		font: {
			fontWeight: 'bold',
			fontSize: 24
		},
		bottom: 50
	}
};

// chain calls
$.index.add(Alloy.createController('normalChild').updateViews(opts).getView());

$.index.add(Alloy.createController('normalchild', {
	text: 'Set the old-fashioned way'
}).getView());

$.index.open();