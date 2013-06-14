try {
	require('specs/buttons')($);
} catch(e) {
	Ti.API.warn('no unit tests found for buttons.js');
}