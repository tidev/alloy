if (!ENV_PROD) {
	require('specs/proxy')($);
}