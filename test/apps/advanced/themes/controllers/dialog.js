var anim;

function handleAnimation(e) {
	anim.removeEventListener('complete', handleAnimation);
	$.button.title = 'You made it!';
}

function closeDialog(e) {
	// cleanup animation
	anim.removeEventListener('complete', handleAnimation);
	if (!OS_ANDROID) {
		$.progressFront.animate();
	}
	
	// close dialog
	$.dialog.close();
}

exports.show = function(duration) {
	// initialize progress dialog
	$.button.title = 'I quit!';
	$.progressFront.width = 20;
	$.dialog.open();
	
	// animate the custom progress dialog
	anim = Ti.UI.createAnimation({
		duration: duration,
		width: 198,
		height: 28
	});
	anim.addEventListener('complete', handleAnimation);
	$.progressFront.animate(anim);
}