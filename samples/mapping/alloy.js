var geo = require('geo');

Alloy.Globals.LATITUDE_BASE = 37.389569;
Alloy.Globals.LONGITUDE_BASE = -122.050212;

if (OS_IOS || OS_ANDROID) {
	Alloy.Globals.Map = Ti.Map = require('ti.map');
}
Alloy.Globals.winTop = (OS_IOS && parseInt(Ti.Platform.version, 10) >= 7) ? 20 : 0;
Ti.UI.backgroundColor = "#fff";