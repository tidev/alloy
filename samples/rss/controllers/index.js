var isIpad = OS_IOS && Alloy.isTablet;
var usesNavGroup = (OS_IOS && Alloy.isHandheld) || OS_MOBILEWEB;

// save a global reference to the navgroup on iPhone
if (usesNavGroup) {
	Alloy.Globals.navgroup = $.navgroup;	
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
		Alloy.Globals.navgroup.open(win);	
	} else if (OS_ANDROID) {
		win.open();
	}
});

if (OS_ANDROID) {
	$.master.getView().open();
} else {
	$.index.open();
}
