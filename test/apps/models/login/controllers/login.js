var user = Alloy.Models.user;

function focusPassword() {
	$.password.focus();
}

function login(e) {
	// blur textfield, if login() was launched from textfield
	if (e && e.source && _.isFunction(e.source.blur)) {
		e.source.blur();
	}

	if (user.login($.username.value, $.password.value)) {
		Alloy.createController('home').getView().open();
		$.login.close();
	} else {
		alert('login failed');
	}
}