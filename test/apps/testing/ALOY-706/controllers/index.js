$.index.open();

$.newLabel = $.UI.create('Ti.UI.Label', {
	id: 'newLabel',
	classes: 'main',
	bottom: 0,
	text: '$.UI.create() Label',
	textAlign: 'center'
});
$.index.add($.newLabel);

try {
	require('specs/index')($);
} catch(e) {
	Ti.API.warn('no unit tests found for index.js');
}