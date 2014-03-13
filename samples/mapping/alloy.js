var geo = require('geo');

Alloy.Globals.LATITUDE_BASE = 37.389569;
Alloy.Globals.LONGITUDE_BASE = -122.050212;

// always use the module on android
if (OS_ANDROID) {
	Ti.Map = require('ti.map');

// use the module on iOS with TiSDK 3.2.0+
} else if (OS_IOS) {
	var parts = Ti.version.split('.'),
		major = parseInt(parts[0], 10),
		minor = parseInt(parts[1], 10);

	if (major > 3 || (major === 3 && minor >= 2)) {
		Ti.Map = require('ti.map');
	}
}
