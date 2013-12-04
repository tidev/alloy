var geo = require('geo');

Alloy.Globals.LATITUDE_BASE = 37.389569;
Alloy.Globals.LONGITUDE_BASE = -122.050212;

if (OS_IOS || OS_ANDROID) {
	Ti.Map = require('ti.map');
}
