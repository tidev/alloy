if (OS_IOS) { // || OS_MOBILEWEB) {
	// attach the navgroup to Alloy.CFG so it can be accessed globally
	Alloy.CFG.navgroup = $.navgroup;

	// We can do most of this in markup once we resolve:
	// https://jira.appcelerator.org/browse/ALOY-202
	var button = Ti.UI.createButton({ title: 'next' });
	button.addEventListener('click', function(e) {
		$.navgroup.open(Alloy.getController('win2').getView());
	});
	$.win1.rightNavButton = button;
}

$.index.open();