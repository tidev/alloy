var args = arguments[0] || {};

for (var k in args) {
	$.loading[k] = args[k];	
}

if (Ti.Platform.osname === 'mobileweb') {
    $.loading.duration = 100;
} 
$.loading.start();

exports.setOpacity = function(opacity) {
	$.loading.opacity = opacity;		
};