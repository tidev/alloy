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
		Ti.API.info(user.toJSON());
		alert('open app');
	} else {
		alert('login failed');
	}
}

// fetch the user model
user.fetch();
Ti.API.info(user.toJSON());

if (user.validateAuth()) {
	$.index.open();
} else {
	// open some other view
}

$.index.open();