function doClick(e) {
	alert($.t.text);
}

$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}