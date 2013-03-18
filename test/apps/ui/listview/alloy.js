var parts = Ti.version.split('.');
var version = parts[0]*100 + parts[1]*10 + parts[2]*1; 
if (version < 310) {
	alert('Ti.UI.ListView requires Titanium SDK 3.1.0 or higher');
}