// We can do most of this in markup once we resolve:
// https://jira.appcelerator.org/browse/ALOY-202
var button = Ti.UI.createButton({ title: 'next' });
button.addEventListener('click', function(e) {
	// Access navgroup from Alloy.CFG, set in index.js
	Alloy.CFG.navgroup.open(Alloy.createController('win3').getView());
});
$.win2.rightNavButton = button;