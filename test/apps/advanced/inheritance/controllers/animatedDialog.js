// Establish inheritance from baseDialog
exports.baseController = 'baseDialog';

// Override baseDialog's openDialog() function. We will still
// be able to use baseDialog's closeDialog() function.
exports.openDialog = function(win) {
	$.refWin = win;

	// make invisible
	$.cover.opacity = 0;
	$.dialog.opacity = 0;

	// add to reference window
	$.refWin.add($.cover);
	$.refWin.add($.dialog);

	// animate in the opacity
	$.cover.animate({
		duration: 500,
		opacity: 0.5
	});
	$.dialog.animate({
		duration: 500,
		opacity: 1
	});
};