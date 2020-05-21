function openDialog(e) {
	Alloy.createController(e.source.title, {
		message: 'Opened ' + e.source.title
	}).openDialog($.index);
}

$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}