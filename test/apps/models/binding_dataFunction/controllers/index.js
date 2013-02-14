var locations = Alloy.Collections.locations;

function transformData(model) {
	var attrs = model.toJSON();
	attrs.imageUrl = '/' + attrs.direction + '.png';
	attrs.upperCaseName = attrs.name.toUpperCase();
	return attrs;
}

function doChanges(e) {
	// grab a random model by index
	var index = Math.round((locations.length-1)*Math.random());
	var model = locations.at(index);

	// modify the model...
	model.set(
		// just add a + to the end of the model's name
		{ name: model.get('name') + '+' },

		// set silent to true to prevent data binding 
		// from firing automatically. Silent changes will
		// not trigger data binding to update.
		{ silent: true } 
	);
}

// call the binding function name we defined in the 
// dataFunction attribute
updateUi();

$.index.open();