Alloy.Globals.setupWindow($.win);

// Change the visual state of $.theButton on touch start and end
function buttonDown(e) {
	$.theButton.applyProperties({
		backgroundColor: '#18a0d4',
		color: '#ddd',
		height: '55dp',
		width: '140dp'
	});
}

function buttonUp(e) {
	$.theButton.applyProperties({
		backgroundColor: '#38c0f4',
		color: '#fff',
		height: '60dp',
		width: '150dp'
	});
}

// Toggle the dimensions of $.theImage on clicks
var imageIndex = 1;
var styles = [
	{
		height: '124dp',
		width: '200dp'
	},
	{
		height: null,
		width: '100%'
	},
	{
		height: 1200,
		width: '100%'
	}
];
function changeImage(e) {
	$.theImage.height = styles[imageIndex].height;
	$.theImage.width = styles[imageIndex].width;
	imageIndex++;
	if (imageIndex >= styles.length) { imageIndex = 0; }
}
changeImage();

// Print the id, classes, and apiName of all UI components created from XML.
// Depending on the value of "autoStyle" in config.json, the <Alloy> element, or
// on each individual XML element, you will see whether or not those
// properties are populated.
//
// An XML element without autoStyle enabled by one of the aforementioned means
// will have only the id property attached to the proxy. On the other hand, an
// XML element with autoStyle enabled will have id, classes, and apiName
// attached. This may not seem important now when styles are set only at compile
// time (or manually as in the touch listeners above), but is very important
// once you start using the $.addClass() and $.removeClass() functions in the
// "Add/Remove Class" section of this app.
_.each(['win','scroll','label1','label2','theButton','theImage'], function(id) {
	var proxy = $[id];
	Alloy.Globals.print({
		apiName: proxy.apiName,
		classes: proxy.classes,
		id: proxy.id
	}, id);
});
