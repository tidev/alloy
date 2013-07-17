function doClick(e) {
	alert(e.source.title);
}

function openWin2(e) {
	Alloy.createController('win2').getView().open();
}

$.index.open();