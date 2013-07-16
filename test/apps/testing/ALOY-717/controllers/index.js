var classes = [
	'transform',
	'opacity',
	'bgGradient',
	'greenBg',
	'red',
	'shadow',
	'huge',
	'right',
	'zIndex'
];

function changeClasses(e) {
	var c = $.tester.classes[0];
	if (c) {
		Ti.API.info('Removing class "' + c + '"');
		$.removeClass($.tester, c);
	} else {
		Ti.API.info('adding classes: ' + JSON.stringify(classes));
		$.addClass($.tester, classes);
	}
	$.tester.text = JSON.stringify($.tester.classes);
}

changeClasses();
$.index.open();