var views = Alloy.Collections.views = new Backbone.Collection();
views.reset([
	{
		id: 1,
		title: 'Raw Style Modules',
		subtitle: 'Find out what\'s in the new runtime style modules',
		shortTitle: 'Style Modules',
		controller: 'rawStyle'
	},
	{
		id: 2,
		title: 'Creating Style Objects',
		subtitle: 'Titanium proxy constructor objects from TSS at runtime',
		shortTitle: 'Alloy.createStyle()',
		controller: 'createStyle'
	},
	{
		id: 3,
		title: 'Creating Styled Titanium Proxies',
		subtitle: 'Create and style a Titanium proxy in a single call',
		shortTitle: 'Alloy.UI.create()',
		controller: 'uiCreate'
	},
	{
		id: 4,
		title: '"autoStyle" property',
		subtitle: 'How to configure components to be enabled for dynamic styling',
		shortTitle: 'autoStyle',
		controller: 'autoStyle'
	},
	{
		id: 5,
		title: 'Add/Remove Classes',
		subtitle: 'Dynamically add and remove TSS classes from UI components',
		shortTitle: 'Add/Remove Classes',
		controller: 'classes'
	}
]);

Alloy.Globals.setupWindow = function(win) {
	Alloy.Globals.currentWindow = win;
	if (OS_ANDROID) {
		win.addEventListener('android:back', Alloy.Globals.closeWindow);
	}
};

Alloy.Globals.closeWindow = function() {
	if (Alloy.Globals.currentWindow) {
		if (OS_ANDROID) {
			Alloy.Globals.currentWindow.removeEventListener(
				'android:back', Alloy.Globals.closeWindow);
		}
		Alloy.Globals.currentWindow.close();
		Alloy.Globals.currentWindow = null;
	}
};

Alloy.Globals.print = function(o, title) {
	if (title) {
		Ti.API.info('******** ' + title + ' ********');
	}
	Ti.API.info(JSON.stringify(o, null, '  '));
	Ti.API.info(' ');
};

Alloy.Globals.htmlTemplate = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><script type="text/javascript" src="web/syntaxhighlighter/scripts/shCore.js"></script><script type="text/javascript" src="web/syntaxhighlighter/scripts/shBrushJScript.js"></script><link type="text/css" rel="stylesheet" href="web/syntaxhighlighter/styles/shCoreDefault.css"/><script type="text/javascript">SyntaxHighlighter.all();</script></head><body style="background: white; font-family: Helvetica; "><pre class="brush: <%= BRUSH %>; gutter: false;"><%= CODE %></pre></html>';
