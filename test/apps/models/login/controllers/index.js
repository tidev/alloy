var user = Alloy.Models.user;

// Fetch the user model
user.fetch();

// If the user is already logged in, show the home view. If
// the user is not yet login, show the login view.
Alloy.createController(user.validateAuth() ? 'home' : 'login').getView().open();