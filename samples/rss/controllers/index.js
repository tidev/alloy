var isIpad = OS_IOS && Alloy.isTablet;
var usesNavGroup = (OS_IOS && Alloy.isHandheld) || OS_MOBILEWEB;

// save a global reference to the navgroup on iPhone
if (usesNavGroup) {
	Alloy.Globals.navgroup = OS_MOBILEWEB ? $.navgroup : $.index;
}

if(isIpad) {
	// on iPad: show a Feeds button in the details window's
	// title bar; when clicked, it shows the master window
	// in a pop-up
	$.index.addEventListener('visible',function(e){
		if (e.view == 'detail'){
			e.button.title = "Feeds";
			$.detail.win.leftNavButton = e.button;
		} else if (e.view == 'master'){
			$.detail.win.leftNavButton = null;
		}
	});
}

// respond to detail event triggered on index controller
$.master.on('detail', function(e) {
	// get the detail controller and window references
	var controller = isIpad ? $.detail : Alloy.createController('detail');
	var win = controller.getView();

	// set the new detail article
	controller.setArticle(e.row.articleUrl);

	// open the detail windows
	if (usesNavGroup) {
		if (OS_MOBILEWEB) {
			Alloy.Globals.navgroup.open(win);
		} else {
			Alloy.Globals.navgroup.openWindow(win);
		}
	} else if (OS_ANDROID) {
		win.open();
	}
});

if (OS_ANDROID) {
	$.master.getView().open();
} else {
	$.index.open();
}
