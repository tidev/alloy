function showColorInfo(e) {
	var color = e.row.model.color;
	var collection = Alloy.createCollection('color');

	// fetch color info from the color collection based on the
	// given color from the user model
	collection.fetch({
		query: 'SELECT * FROM colors WHERE color = "' + color + '"'
	});
	var colorModel = collection.at(0);

	// open the color info window
	if (colorModel) {
		var win = Alloy.createController('color', colorModel).getView();
		OS_IOS ? Alloy.Globals.navgroup.open(win) : win.open();
	} else {
		alert('No color info found!');
	}
}

Alloy.Collections.user.fetch();