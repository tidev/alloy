function doSave(e) {
	alert('save');
}

if (OS_IOS || OS_MOBILEWEB) {
	$.info.text = 'Click the rightNavButton to "save"';
} else if (OS_ANDROID) {
	$.info.text = 'Click the menu button to "save"';
} else {
	$.info.text = 'This app supported on Android, MobileWeb, and iOS only.';
}

$.index.open();