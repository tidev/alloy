function open_window(e) {
	var win = Ti.UI.createWindow({
		backgroundColor: "blue"
	});
	$.navWindow.openWindow(win, { animated: true });
}
