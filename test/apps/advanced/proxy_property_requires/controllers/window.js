function showAlert(e) {
	alert(e.source.title);
}

// runtime unit tests
if (!ENV_PROD) {
	require('specs/window')($);
}