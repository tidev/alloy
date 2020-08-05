/**
 * Alloy for Titanium by Appcelerator
 * This is generated code, DO NOT MODIFY - changes will be lost!
 * Copyright (c) 2012 by Appcelerator, Inc.
 */
var Alloy = require('/alloy'),
	_ = Alloy._,
	Backbone = Alloy.Backbone;

// The globals should be configured by the bootstrap script, however if anyone is using an SDK
// older than 7.5.0 that won't get ran. So set them here if they don't exist
if (!global.Alloy) {
	global.Alloy = Alloy;
	global._ = _;
	global.Backbone = Backbone;
}

__MAPMARKER_ALLOY_JS__

// Open root window if a new UI session has started. Can happen more than once in app's lifetime.
// Event can only be fired if "tiapp.xml" property "run-in-background" is set true.
Ti.UI.addEventListener('sessionbegin', function () {
	Alloy.createController('index');
});

// Open the root window immediately if an active UI session exists on startup.
// Note: The Ti.UI.hasSession property was added as of Titanium 9.1.0.
if ((typeof Ti.UI.hasSession === 'undefined') || Ti.UI.hasSession) {
	Alloy.createController('index');
}
