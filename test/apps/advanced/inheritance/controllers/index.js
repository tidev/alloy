function openDialog(e) {
	if (OS_MOBILEWEB) {
		alert('Mobileweb version not full implemented.\nSee TIMOB-13816 for details.');
	} else {
		Alloy.createController(e.source.title, {
			message: 'Opened ' + e.source.title
		}).openDialog($.index);
	}
}

$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}