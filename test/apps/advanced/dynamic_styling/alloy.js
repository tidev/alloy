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
	},
	{
		id: 6,
		title: 'Styling Plain Titanium Proxies',
		subtitle: 'Turn plain Titanium proxies into fully styled components',
		shortTitle: 'Styling Ti Proxies',
		controller: 'tiproxies'
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
}
