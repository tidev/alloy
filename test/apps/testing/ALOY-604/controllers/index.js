function doSomething(e) {
	Ti.API.info('do something');
}

function test(e) {
	Ti.API.info('test');
}

Alloy.Collections.data.trigger('change');

$.index.open();