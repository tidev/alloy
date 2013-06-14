$.index.open();

try {
	require('specs/index')($);
} catch(e) {
	Ti.API.warn('no unit tests found for index.js');
}