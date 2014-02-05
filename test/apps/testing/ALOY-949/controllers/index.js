var dialogs = require('alloy/dialogs');

function changeNothing() {
	dialogs.confirm({
		callback: changeWithExports
	});
}

function changeWithExports() {
	dialogs.title = 'Confirm (exports)';
	dialogs.message = 'For real?';
	dialogs.buttonNames = ['Naaah', 'Fo shizzle'];

	dialogs.confirm({
		callback: changeWithArgs
	});
}

function changeWithArgs() {
	dialogs.confirm({
		title: 'Confirm (args)',
		message: 'Are the args working?',
		buttonNames: ['Nope', 'Yup'],
		callback: shouldUseExportsAgainByDefault
	});
}

function shouldUseExportsAgainByDefault() {
	dialogs.confirm();
}

$.index.open();

changeNothing();