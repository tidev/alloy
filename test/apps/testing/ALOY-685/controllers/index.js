var styler = require('alloy/styler');

$.index.open();

// add the dynamically created style to new labels
var labels = [];
for (var i = 0; i < 4; i++) {
	// generate and print the style based on the current controller, the attributes
	// of the style, and any additional properties we want to add
	var theStyle = styler.generateStyle('index', {
		// used by generateStyle() to merge styles
		apiName: 'Label',
		class: ['blue','shadow'],
		id: 'label' + (i+1),

		// additional properties to be merged in a final step
		textAlign: 'left',
		text: 'I\'m ugly, but styled dynamically!'
	});

	// in practice you wouldn't make multiple copies of a UI component with the
	// same id attribute, but this is just 
	var label = Ti.UI.createLabel(theStyle);
	labels.push(label);
	$.index.add(label);
}

// run unit tests
try {
	require('specs/index')($, {
		labels: labels
	});
} catch(e) {
	Ti.API.warn('No unit tests for controller "index"');
}
