function popWindow(e) {
	Alloy.Globals.ctr--;
	Alloy.Globals.navwindow.pop($.win);
}

$.win.title = "Window #" + Alloy.Globals.ctr;
$.windowNumber.text = "I'm window #" + Alloy.Globals.ctr + " on the stack";