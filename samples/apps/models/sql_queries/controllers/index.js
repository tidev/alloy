function openAddUser(e) {
	Alloy.createController('add').getView().open();
}

// save reference to NavigationGroup on iOS
if (OS_IOS) {
	Alloy.Globals.navgroup = $.index;
}

$.index.open();