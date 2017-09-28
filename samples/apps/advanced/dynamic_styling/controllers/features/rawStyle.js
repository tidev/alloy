Alloy.Globals.setupWindow($.win);

$.styleModule.html = _.template(Alloy.Globals.htmlTemplate, {
	CODE: "require('alloy/styles/rawStyle')",
	BRUSH: 'js'
});

$.styleArray.html = _.template(Alloy.Globals.htmlTemplate, {
	CODE: JSON.stringify(require('alloy/styles/features/rawStyle'), null, '  '),
	BRUSH: 'js'
});