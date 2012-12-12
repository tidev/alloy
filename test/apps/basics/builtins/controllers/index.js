// These "builtin" requires will be detected by the alloy compile process.
// You do not need to manually copy them to their project location.
// When the alloy compile finds these require calls, it will include them
// in your Titanium project as "Resources/alloy/animation.js" and
// "Resources/alloy/string.js" automatically.
var animation = require('alloy/animation'),
	string = require('alloy/string');

function ShakeClick(e) { 
    animation.shake($.mover, 0, function (){ alert("Shake ended."); });
}

function FlashClick(e) { 
    animation.flash($.mover);
}

function TrimClick(e) {
	$.label.text = string.trim($.label.text);
}

$.index.open();
