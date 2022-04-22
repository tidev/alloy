const tabgroup = require('@/tabgroup');

function doClick (e) {
	if (e.section === $.settingsSection) {
		const title = e.row.name;
		const window = Alloy.createController('/profile/emptyWindow', { title }).getView();
		tabgroup.openWindow(window);
	} else {
		console.log('Logout pressed.');
	}
}
