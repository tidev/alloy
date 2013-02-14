function isDefined(val) {
	return typeof val !== 'undefined' && val !== null;
}

function transformData(model) {
	var attrs = model.toJSON();
	!isDefined(attrs.height) && (attrs.height = Ti.UI.SIZE);
	!isDefined(attrs.width) && (attrs.width = Ti.UI.SIZE);
	return attrs;
}

// Fire a dummy event to initiate binding
Alloy.Collections.images.trigger('fetch');

$.index.open();