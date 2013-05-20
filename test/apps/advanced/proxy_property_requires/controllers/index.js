$.index.open();

Alloy.Collections.dummy.trigger('change');

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}