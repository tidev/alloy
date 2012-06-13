$.detail.updateContent = function(o) {
	$.image.image = o.image;
};

$.closeButton.addEventListener('click', function(e) {
	exports.close();
});