if (!Ti.App.Properties.hasProperty('seeded')) {
	var pins = [
		{ title: 'Appcelerator', latitude: 37.3892876, longitude: -122.0502364},
		{ title: 'SETI Institute', latitude: 37.386697, longitude: -122.052028},
		{ title: 'Someplace nearby', latitude: 37.3880608, longitude: -122.0559039}
	];
	for (var i = 0, j = pins.length; i < j; i++) {
		Alloy.createModel('pins', {
			title: pins[i].title,
			latitude: pins[i].latitude,
			longitude: pins[i].longitude
		}).save();
	}
	Ti.App.Properties.setString('seeded', 'yuppers');
}

Alloy.Collections.pins.fetch();

function doTransform(model) {
	var transform = model.toJSON();
	transform.title = '[' + transform.title + ']';
	return transform;
}

function doFilter(collection) {
	return collection.where({title:'Appcelerator'});
}


$.index.open();