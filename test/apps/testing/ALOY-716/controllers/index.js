function doUpper(model) {
	// Need to convert the model to a JSON object
	var transform = model.toJSON();
	transform.title = transform.title.toUpperCase();
	Ti.API.info('>>> transforming the title');
	return transform;
}

Alloy.Collections.collection.trigger('change');

$.index.open();