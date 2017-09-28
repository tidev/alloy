function addView() {
	$.scroller.views = $.scroller.views.concat(Ti.UI.createView({
		backgroundColor: '#ff0'
	}));
}

$.index.open();
