$.index.add(Alloy.createController('childview', {
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
	"#someNonExistentId": { text: 'I do not exist'}
}).getView());

$.index.open();