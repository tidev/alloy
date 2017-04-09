function onClick(e) {
	$.trigger('customevent', {sender: $, data: e});
}