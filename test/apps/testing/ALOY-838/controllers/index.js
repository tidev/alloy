function doClick(e) {
	alert('Check console output');
	Ti.API.debug(JSON.stringify(Alloy.CFG, null, '\t'));
}

$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}