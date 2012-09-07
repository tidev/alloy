$.btn.on('click', function() {
	$.trigger('someEvent', {
		message:$.text.value
	});
});