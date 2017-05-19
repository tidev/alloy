var major = parseInt(Ti.Platform.version.split('.')[0], 10);

if (OS_IOS || (OS_ANDROID && major >= 3)) {
	Alloy.Globals.top = OS_IOS && major >= 7 ? 20 : 0;
	Alloy.createController('lists').getView().open();
} else {
	Alloy.createController('not_supported').getView().open();
}
