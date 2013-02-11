var geo = require('geo');

var self = this;

$.button.addEventListener('click', function(e) {
    $.textField.blur();
    geo.forwardGeocode($.textField.value, function(geodata) {
        self.trigger('addAnnotation', {geodata: geodata});
    });
});
