Ti.API.info('bottom controller is executing');

// runtime unit tests
if (!ENV_PROD) {
	require('specs/bottom')($);
}
