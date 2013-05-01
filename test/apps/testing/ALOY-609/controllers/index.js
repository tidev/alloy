var info = Alloy.Collections.info;

// assign a ListItem template based on the contents of the model
function doTransform(model) {
	var o = model.toJSON();
	if (o.subtitle) {
		if (o.image) {
			o.template = 'fullItem';
		} else {
			o.template = 'titleAndSub'
		}
	} else {
		o.template = 'title';
	}
	return o;
}

// Handle the buttonClick event triggered from the button controller.
// Notice that we will be updating the ListView UI without actually ever
// referring directly to the ListView itself, only modifying the model on
// which it relies.
function doButtonClick(e) {
	if (_.isEmpty(e.modelObj)) {
		// use a custom query to quickly empty the SQLite store
		var db = Ti.Database.open('_alloy_');
		db.execute('DELETE FROM info;');
		db.close();

		// refresh the collection to reflect this in the UI
		info.fetch();
	} else {
		// create a model for the listitem
		var model = Alloy.createModel('info', e.modelObj);

		// add model to collection which will in turn update the UI
		info.add(model);

		// save the model to SQLite
		model.save();
	}
}

$.index.open();

info.fetch();
