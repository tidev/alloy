$.win.open();

function expand (e) {
	$.item3.expandActionView();
}

function collapse(e) {
	$.item3.collapseActionView();
}

function report(e) {
	Ti.API.info(e.type);
	Ti.API.info($.item3.actionViewExpanded);
}