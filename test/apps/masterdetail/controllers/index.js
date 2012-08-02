$.master.open();
$.master.addEventListener('rowClick', function(e) {
	$.detail.updateContent(e);
	$.detail.open();
});
