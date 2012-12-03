function addItem(e) {
	alert('do something');
}

if (OS_IOS || OS_MOBILEWEB) {
	var button = Ti.UI.createButton({
		title: 'add item'
	});
	button.addEventListener('click', addItem);
	$.window.rightNavButton = button;
} 