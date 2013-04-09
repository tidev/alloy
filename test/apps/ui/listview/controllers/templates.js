var moreItems = [];
var lastPos = 'left';
for (var i = 0; i < 255; i++) {
	// gradual increase to red
	var hex = i.toString(16);
	if (hex.length < 2) {
		hex = '0' + hex;
	}

	// get the label textAlign
	var textAlign = i % 2 ? 'center' : lastPos === 'left' ? (lastPos = 'right') : (lastPos = 'left');

	// create tems based on template2 from markup
	moreItems.push({
		template: 'template2',
		label: {
			text: 'row ' + (i+1),
			color: '#' + hex + '0000', 
			textAlign: textAlign,
			width: Ti.UI.FILL
		}
	});
}

// append programmatic items to the ones from markup
$.list.sections[0].items = $.list.sections[0].items.concat(moreItems);