var user = Alloy.Models.user;

function focusPassword() {
	$.password.focus();
}

function login(e) {
	if (e && e.source && _.isFunction(e.source.blur)) {
		e.source.blur();
	}

	var u = $.username.value;
	var p = $.password.value;
	
	if (user.login(u,p)) {
		Alloy.createController('home').getView().open();
		$.login.close();
	} else {
		alert('login failed');
	}
}