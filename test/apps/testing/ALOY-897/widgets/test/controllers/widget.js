var args = arguments[0] || {};

for (var k in args) {
	//if (k.indexOf('__') === 0) { continue; }
	Ti.API.info('key: ' + k);
	$.loading[k] = args[k];
}