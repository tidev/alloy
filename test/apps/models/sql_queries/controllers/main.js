function showColorInfo(e) {
	var color = e.row.model.color;
	var collection = Alloy.createCollection('color');

	// fetch() color info from the color collection based on the
	// given color from the user model. We can use a plain query string
	// like the commented property, or a prepared statement like the
	// one in use below.
	collection.fetch({
		// query: 'SELECT * FROM colors WHERE color = "' + color + '"'
		query: {
			statement: 'SELECT * FROM colors WHERE color = ?',
			params: [color]
		}
	});
	var colorModel = collection.at(0);

	// open the color info window
	if (colorModel) {
		var win = Alloy.createController('color', colorModel).getView();
		if (OS_IOS) {
			Alloy.Globals.navgroup.openWindow(win);
		} else {
			win.open();
		}
	} else {
		alert('No color info found!');
	}
}

Alloy.Collections.user.fetch();