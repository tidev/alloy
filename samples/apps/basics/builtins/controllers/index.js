// These "builtin" requires will be detected by the alloy compile process.
// You do not need to manually copy them to their project location.
// When the alloy compile finds these require calls, it will include them
// in your Titanium project as "Resources/alloy/animation.js" and
// "Resources/alloy/string.js" automatically.
var animation = require('alloy/animation'),
	string = require('alloy/string');

function shake(e) {
	animation.shake($.mover, 0, function () {
		alert('Shake ended.');
	});
}

function flash(e) {
	animation.flash($.mover);
}

function trim(e) {
	$.label.text = string.trim($.label.text);
}

function flip(e) {
	var front, back;

	e.bubbleParent = false;
	if (e.source === $.back) {
		front = $.back;
		back = $.front;
	} else {
		front = $.front;
		back = $.back;
	}
	animation.flipHorizontal(front, back, 500, function(e) {
		Ti.API.info('flipped');
	});
}

$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}
