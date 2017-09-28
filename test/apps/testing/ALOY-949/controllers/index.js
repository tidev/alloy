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
		title: 'Confirm (args.buttonNames)',
		message: 'Are the args.buttonNames working?',
		buttonNames: ['Nope', 'Yup'],
		callback: changeWithArgsAgain
	});
}

function changeWithArgsAgain() {
	dialogs.confirm({
		title: 'Confirm (args.no:Neh & args.yes:Yeah)',
		message: 'Are the args.no & args.yes taking precedence?',
		buttonNames:['Nope', 'Yup'],
		no: 'Neh',
		yes: 'Yeah',
		callback: shouldUseExportsAgainByDefault
	});
}

function shouldUseExportsAgainByDefault() {
	dialogs.confirm();
}

$.index.open();

changeNothing();
