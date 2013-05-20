function handler(e) {
	alert('got this from custom event: '+e.message);
}

function removeListener() {
	$.requiredController.off('someEvent', handler);
}

$.requiredController.on('someEvent', handler);

$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}