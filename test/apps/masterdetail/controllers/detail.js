$.closeButton.addEventListener('click', function(e) {
	$.detail.close();
});

$.updateContent = function(o) {
	$.image.image = o.image;
};

$.open = function(o) {
	$.detail.open(o);
};