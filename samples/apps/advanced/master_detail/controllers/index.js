if (OS_IOS && Alloy.isHandheld) {
	Alloy.Globals.navgroup = $.index;
}

$.master.on('detail', function(e) {
	// get the detail controller and window references
	var controller = OS_IOS && Alloy.isTablet ? $.detail : Alloy.createController('detail');
	var win = controller.getView();

	// get boxer stats by name
	controller.setBoxerStats(e.row.fighterName);

	// open the detail windows
	if (OS_IOS && Alloy.isHandheld) {
		Alloy.Globals.navgroup.openWindow(win);
	} else if (OS_ANDROID) {
		win.open();
	}
});

if (OS_ANDROID) {
	$.master.getView().open();
} else {
	$.index.open();
}

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}