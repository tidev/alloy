var index = 0;
var classes = [
	['darkblue','medium'],
	['darkblue','medium','red'], // red will take precedence due to TSS ordering
	['lightblue','huge'],
	'red small',
	['darkblue','medium','left'],
	'lightblue small right',
	'red huge crazyshadow'
];
function resetClasses(e) {
	var theClass = classes[index++];
	$.resetClass($.tester, theClass);
	$.currentClasses.text = JSON.stringify(theClass);
	index >= classes.length && (index = 0);
}
resetClasses();

$.index.open();