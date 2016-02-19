var IMAGES = [
	'/images/alien.png',
	'/images/predator.png',
	'/images/pod.png'
];

var moreItems = [];
var lastPos = 'left';
var imageCtr = 0;
for (var i = 0; i < 1023; i++) {

	// gradual increase to red
	var hex = (i%256).toString(16);
	if (hex.length < 2) {
		hex = '0' + hex;
	}

	// Use a different template every other row
	if (i%2) {
		moreItems.push({
			template: 'requiredTemplate',
			leftImage: {
				image: IMAGES[imageCtr++]
			},
			rightImage: {
				image: i%5 ? '/images/up.png' : '/images/down.png'
			},
			title: {
				text: 'This is my title'
			},
			subtitle: {
				text: 'And this is the subtitle'
			}
		});
		if (imageCtr >= IMAGES.length) { imageCtr = 0; }
	} else {
		var textAlign = lastPos === 'left' ? (lastPos = 'right') : (lastPos = 'left');
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
}

// append programmatic items to the ones from markup
$.list.sections[0].items = $.list.sections[0].items.concat(moreItems);