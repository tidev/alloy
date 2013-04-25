var anim = require('alloy/animation');

var DURATION = 1000;

function fadeIn(view, duration) {
	anim.fadeIn(view, duration, function() {
		fadeOut(view, duration);
	});
}

function fadeOut(view, duration) {
	anim.fadeOut(view, duration, function() {
		fadeIn(view, duration);
	});
}

$.index.open();

fadeIn($.view1, 1000);
fadeOut($.view2, 1000);
fadeIn($.view3, 2000);