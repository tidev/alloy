$.win.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}