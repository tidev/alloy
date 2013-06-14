try {
	require('specs/labels')($);
} catch(e) {
	Ti.API.warn('no unit tests found for labels.js');
}