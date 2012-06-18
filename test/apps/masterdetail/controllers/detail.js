$.closeButton.addEventListener('click', function(e) {
	exports.close();
});

$.updateContent = function(o) {
	$.image.image = o.image;
};

$.open = function(o) {
	$.detail.open(o);
};