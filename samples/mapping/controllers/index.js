/*
	To run this demo app on Android, you must obtain a Google Maps API v2 key
	from the Google API console and update your tiapp.xml file.
	- keys are associated with your Google developer account and the app's app ID
	- you might need to change the app ID assigned by default to this demo app

	Furthermore, you must run the app on a device (or emulator) that has the
	Google Play Services installed. The stock Android emulators do not have these
	services installed by default. You can add them. Or, run the app on a device
	that has been registered to a Google account and has Play Services installed.

	Additional information is in the documentation:
	http://docs.appcelerator.com/titanium/latest/#!/guide/Google_Maps_v2_for_Android
*/

$.addAddress.on('addAnnotation', function(e) {
	$.map.addAnnotation(e.geodata);
});

$.index.open();
