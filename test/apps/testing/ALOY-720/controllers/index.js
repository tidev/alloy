function doSave(e) {
	alert('save');
}

if (OS_IOS) {
	$.info.text = 'Click the rightNavButton to "save"';
} else if (OS_ANDROID) {
	$.info.text = 'Click the menu button to "save"';
} else {
	$.info.text = 'This app only supported on Android and iOS';
}

$.index.open();