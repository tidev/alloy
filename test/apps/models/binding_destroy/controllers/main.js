function openWindow(name) {
	var win = Alloy.createController(name).getView();
	if (OS_ANDROID) {
		win.open();
	} else {
		Alloy.Globals.navgroup.open(win);	
	}
}

function showInfo() {
	openWindow('info');
}

function showMovies() {
	openWindow('movies');
}