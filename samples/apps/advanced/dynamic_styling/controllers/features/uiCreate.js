Alloy.Globals.setupWindow($.win);

var testLabel;
var index = 0;

// $.UI.create() will create a fully styled Titanium API component. It is
// essentially combining a $.createStyle() call with a Titanium API create
// function call. $.UI.create() takes 2 parameters:
//
// apiName: The Titanium API comopnent to be created. So if you wanted to
//          create an ImageView, this value would be "Ti.UI.ImageView", or
//          just simply "ImageView".
// style:   An object that contains properties for creating this Titanium API
//          component's constructor object. These properties include:
// - classes: An array of TSS classes that apply to the created style.
// - id:      A string indicating the id associated with the component.
//
//   In addition to the above properties, you can also add any other relevant
//   properties that apply to the target component. There are examples below.
//
// NOTE: Most of the styles you'll find applied here, and throughout this app,
//       will be found in app.tss so that they are accessible by all
//       controllers.
var styles = [
	{},
	{
		classes: ['blue', 'shadow', 'large'],
		id: 'tester'
	},
	{
		classes: ['dark', 'huge']
	},
	{
		classes: ['shadow'],
		id: 'specificLabel',

		// a few inline properties
		borderWidth: 2,
		borderRadius: 16,
		borderColor: '#000'
	}
];

function changeStyle(e) {
	// Get a reference to the style properties we will use when creating our
	// styled Titanium API component.
	var styleArgs = styles[index++];
	Alloy.Globals.print(styleArgs, 'styleArgs');

	// let's add the default test to the style arguments
	styleArgs.text = 'test label';

	// Remove the existing label.
	if (testLabel) {
		$.container.remove(testLabel);
		testLabel.removeEventListener('click', changeStyle);
	}

	// Use $.UI.create() to create a styles Ti.UI.Label
	testLabel = $.UI.create('Label', styleArgs);
	testLabel.addEventListener('click', changeStyle);
	$.container.add(testLabel);

	// reset the index
	if (index >= styles.length) { index = 0; }
}

changeStyle();
