## Mapping

This guide describes all the configuration you need to run this demo app.

### iOS

Add the following to modules session in the *tiapp.xml* file

```
<modules>
	<module platform="iphone">ti.map</module>
</modules>
```

### Android

To run this demo app on Android, you must:
1. Create a Google API project
2. Enable Google Map Android API v2 for the Google API project
3. Get a Google Maps API v2 key from the Google API console
	* The package name is the Application ID from the *tiapp.xml* file.
	* Keys are associated with your Google developer account and the app's ID from the *tiapp.xml* file.
	* You might need to change the app ID assigned by default to this demo app
4. Update *tiapp.xml* and *alloy.jmk* by replacing the text **ENTER_YOUR_API_KEY_HERE** with your Google API key.
5. Add the following to modules session in the *tiapp.xml* file
```
<modules>
	<module platform="android">ti.map</module>
</modules>
```

Furthermore, you must run the app on a device (or emulator) that has the Google Play Services installed.
The stock Android emulators do not have these services installed by default. You can add them. Or, run the app on a device
that has been registered to a Google account and has Play Services installed.

Please review the documentation here on step by step guide to obtain a Google Maps API v2 key from the Google API console:
[Google_Maps_v2_for_Android](http://docs.appcelerator.com/titanium/latest/#!/guide/Google_Maps_v2_for_Android)



----------------------------------
Stuff our legal folk make us say:

Appcelerator, Appcelerator Titanium and associated marks and logos are
trademarks of Appcelerator, Inc.

Titanium is Copyright (c) 2008-2015 by Appcelerator, Inc. All Rights Reserved.

Titanium is licensed under the Apache Public License (Version 2). Please
see the LICENSE file for the full license.
