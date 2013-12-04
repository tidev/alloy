var geo = require('geo');

$.button.addEventListener('click', function(e) {
	$.textField.blur();
	geo.forwardGeocode($.textField.value, function(geodata) {
		$.trigger('addAnnotation', {geodata: geodata});
	});
});
