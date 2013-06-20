function filterCollection(collection) { 
	return collection.filter(function(model) {
		return model.get('text').split(/\s+/)[1] % 2;
	});
}

function transformCollection(model) {
	var o = model.toJSON();
	o.text = '### ' + o.text + ' ###';
	return o;
}

Alloy.Collections.collection.trigger('change');

$.index.open();