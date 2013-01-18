function fireEvent(e) {
	$.trigger('someEvent', {
		message:$.text.value
	});
}