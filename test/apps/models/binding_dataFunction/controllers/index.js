function transformData(model) {
	var attrs = model.toJSON();
	attrs.imageUrl = attrs.direction + '.png';
	attrs.upperCaseName = attrs.name.toUpperCase();
	return attrs;
}

function doChanges(e) {
	alert('doChanges');
}

function saveChanges(e) {
	alert('saveChanges');
}

// call the binding function name we defined in the 
// dataFunction attribute
updateUi();

$.index.open();