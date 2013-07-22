function doClick(e) {
	$.trigger('click', e);
}

var args = arguments[0] || {};
$.button.title = args.title || 'click me';