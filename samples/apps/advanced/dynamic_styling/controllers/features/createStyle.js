Alloy.Globals.setupWindow($.win);

var testLabel;
var index = 0;

// createStyle() takes 1 object parameter which determines what the generated
// style object will contain. It has a few properties, all are optional:
//
// - apiName: A string indicating which Titanium API component will be styled by
//            the created style object. apiName can be a full API name, like
//            "Ti.UI.Button", or the short version that you use in XML, like
//            "Button".
// - classes: An array of TSS classes that apply to the created style.
// - id:      A string indicating the id associated with the component.
//
// In addition to the above properties, you can also add any other relevant
// properties that apply to the target component. There are examples below.
//
// NOTE: Most of the styles you'll find applied here, and throughout this app,
//       will be found in app.tss so that they are accessible by all
//       controllers.
var styles = [
	{},
	{
		apiName: 'Ti.UI.Label',
		classes: ['blue', 'shadow', 'large'],
		id: 'tester'
	},
	{
		apiName: 'Label',
		classes: ['dark', 'huge']
	},
	{
		apiName: 'Label',
		classes: ['shadow'],
		id: 'specificLabel',

		// a few inline properties
		borderWidth: 2,
		borderRadius: 16,
		borderColor: '#000'
	}
];

function changeStyle(e) {
	// Get a reference to the style properties we will use to generate a new
	// style object.
	var styleArgs = styles[index++];
	Alloy.Globals.print(styleArgs, 'styleArgs');

	// let's add the default test to the style arguments
	styleArgs.text = 'test label';

	// Here we use $.createStyle() to create a style object based on the
	// specified id, classes, and apiName. Those values will be used to compose
	// a style based on all TSS files that apply to the current controller.
	var styleObject = $.createStyle(styleArgs);
	Alloy.Globals.print(styleObject, 'styleObject');

	// Remove the existing label
	if (testLabel) {
		$.container.remove(testLabel);
		testLabel.removeEventListener('click', changeStyle);
	}

	// Create a new Ti.UI.Label using the created style obejct.
	testLabel = Ti.UI.createLabel(styleObject);
	testLabel.addEventListener('click', changeStyle);
	$.container.add(testLabel);

	// reset the index
	if (index >= styles.length) { index = 0; }
}

changeStyle();
