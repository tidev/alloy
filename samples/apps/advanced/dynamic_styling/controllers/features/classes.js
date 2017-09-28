Alloy.Globals.setupWindow($.win);

// Notice here that with addClass() and removeClass() that the syntax is much
// simpler than in the "autoStyle property" section's code.
function buttonDown(e) {
	// $.addClass(proxy, classes, opts) adds one or more TSS classes to an
	// existing Titanium API proxy object. Adding a non-existent class will not
	// cause an error.
	//
	//   proxy:   The Titanium API proxy object to which which we will add one
	//            or more classes, as defined in TSS.
	//   classes: An array or space-separated string of classes to be added to
	//            the given proxy object. Note that even if a string is used,
	//            the resulting "classes" property on the proxy object will
	//            still be stored as an array.
	//   opts:    An optional object containing any additional properties you
	//            would like to manually add to the proxy object, after the
	//            given class(es) have been added.
	$.addClass($.theButton, ['blueButtonDown']);
}

function buttonUp(e) {
	// $.removeClass(proxy, classes, opts) removes one or more TSS classes from
	// an existing Titanium API proxy object. Its signature is identical to that
	// of $.addClass, detailed above. Removing a non-existent class will not
	// cause an error, so there's no need to validate the class listing before
	// executing this function.
	$.removeClass($.theButton, 'blueButtonDown');

	// add/remove "redbg bigger" classes from test labels
	var theClass = 'redbg bigger';
	var defaultText = 'add "' + theClass + '" classes';
	if ($.theButton.text === defaultText) {
		$.addClass($.label1, theClass);
		$.addClass($.label2, theClass);
		$.theButton.text = 'remove "' + theClass + '" classes';
	} else {
		$.removeClass($.label1, theClass);
		$.removeClass($.label2, theClass);
		$.theButton.text = defaultText;
	}
}

// Toggle the dimensions of $.theImage on clicks
var imageIndex = 0;
var classes = ['thumb', 'wide', 'tall'];
function changeImage(e) {
	// reset the classes to change the image's dimensions
	var theClass = classes[imageIndex++];
	$.resetClass($.theImage, theClass);

	// reset imageIndex if necessary
	if (imageIndex >= classes.length) { imageIndex = 0; }
}
changeImage();
