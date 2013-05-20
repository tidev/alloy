// "$.index" is the main Window. If the top-level UI element is not assigned
// an explicit ID, the name of the view is used as its ID automatically.
$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}