function fireEvent(e) {
	$.trigger('someEvent', {
		message:$.text.value
	});
}

// runtime unit tests
if (!ENV_PROD) {
	require('specs/CustomView')($);
}