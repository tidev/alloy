function handler(e) {
	alert('got this from custom event: '+e.message);
}

function removeListener() {
	$.requiredController.off('someEvent', handler);
}

$.requiredController.on('someEvent', handler);

$.index.open();
