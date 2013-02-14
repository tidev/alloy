if (OS_IOS) {
	// If the user is already logged in, show the home view. If
	// the user is not yet login, show the login view.
	Alloy.createController(Alloy.Models.user.validateAuth() ? 'home' : 'login').getView().open();
} else {
	$.index.open();
}