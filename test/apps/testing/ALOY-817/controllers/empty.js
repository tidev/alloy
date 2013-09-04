function buttonClick(e) {
	e.cancelBubble = true;
	Ti.API.info('button clicked');
}

$.empty.fireEvent('click');

setTimeout(function() {
	$.trigger('init');
}, 2000);