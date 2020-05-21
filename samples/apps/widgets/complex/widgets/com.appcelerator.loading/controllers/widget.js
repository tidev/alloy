var args = arguments[0] || {};

for (var k in args) {
	$.loading[k] = args[k];
}

$.loading.start();

exports.setOpacity = function(opacity) {
	$.loading.opacity = opacity;
};