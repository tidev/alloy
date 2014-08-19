$.win2.addEventListener('open', function() {
	if($.win2.activity) {
		$.win2.activity.actionBar.title = "Child window";
	}
});

function doHomeIcon(e) {
	$.win2.close();
}

function doClick(e) {
	alert(e.source.title);
}