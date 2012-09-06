$.btn.on('click', function() {
	$.fire('someEvent', {
		message:$.text.value
	});
});