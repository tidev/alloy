function addItem(e) {
	alert('do something');
}

if (OS_IOS || OS_MOBILEWEB) {
	var button = Ti.UI.createButton({
		title: 'add item'
	});
	button.on('click', addItem);
	$.window.rightNavButton = button;
} 