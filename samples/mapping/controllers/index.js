$.addAddress.on('addAnnotation', function(e) {
    $.map.addAnnotation(e.geodata);
});

$.index.open();
