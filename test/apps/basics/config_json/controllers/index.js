function showAlert(e) {
	alert('Alloy.CFG.someValue = ' + Alloy.CFG.someValue);
}
$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}
