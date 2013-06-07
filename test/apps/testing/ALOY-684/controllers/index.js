var ctr = 0;
var classes = [
	[],
	['big'],
	['blue'],
	'shadow',
	['shadow'],
	['shadow', 'big'],
	['big', 'shadow'],
	['big', 'blue', 'shadow'],
	'big blue shadow'
]

function addNewLabel(e) {
	var index = ctr % classes.length;

	// Alloy.createView() for creating new titanium view proxies with a 
	// given set of style attributes to determine which styles should be
	// applied.
	var label = Alloy.UI.create(
		// the name of the controller from which to reference styles
		'index',

		// The Titanium API to use for the creation. In this case we use "Label"
		// but the full "Ti.UI.Label" would work as well. Like in the XML,
		// implicit namespaces and defaults will be checked if an explicit
		// namespace is not given.
		'Label', 
		
		// The 2nd parameter is an object that holds style information, like id
		// and classes, as well as the typical parameters you would pass to a
		// Titanium proxy. This allows the creation and property application to
		// be done in a single command, making for the best runtime performance. 
		{
			// style attributes
			classes: classes[index],
			id: 'newLabel' + (ctr+1),

			// basic proxy properties that apply to Label
			text: 'this is label #' + (ctr+1),
			touchEnabled: false
		}
	);

	$.index.add(label);
	ctr++;
}

$.index.open();