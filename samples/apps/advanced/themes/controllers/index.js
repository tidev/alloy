function updateLabel(e) {
	$.label.text = Math.round($.slider.value) + 's';
}

function testPatience(e) {
	Alloy.createController('dialog').show($.slider.value * 1000);
}

$.index.open();

if (!ENV_PROD) {
	require('specs/index')($);
}

// test the themed lib/foo.js file, should
// log a message noting the theme's name
var foo = require('foo').foo;
foo();