Alloy.Globals.winTop = (OS_IOS && parseInt(Ti.Platform.version, 10) >= 7) ? 20 : 0;
Ti.UI.backgroundColor = '#eee';
if (OS_IOS) {
	Alloy.Collections.icons = Alloy.createCollection('icon');
}