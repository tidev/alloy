function handler(e) {
	alert('got this from custom event: '+e.message);
}

$.customView.on('someEvent', handler);

$.remove.on('click', function() {
	$.customView.off('someEvent', handler);
});

$.index.open();
