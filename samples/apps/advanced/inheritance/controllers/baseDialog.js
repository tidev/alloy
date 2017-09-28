var args = arguments[0] || {};
$.message.text = args.message || 'dialog';

exports.openDialog = function(win) {
	$.refWin = win;
	$.refWin.add($.cover);
	$.refWin.add($.dialog);
};

exports.closeDialog = function() {
	$.refWin.remove($.cover);
	$.refWin.remove($.dialog);
	$.refWin = $.cover = $.dialog = null;
};

// runtime unit tests
if (!ENV_PROD) {
	require('specs/baseDialog')($, {
		message: $.message.text
	});
}