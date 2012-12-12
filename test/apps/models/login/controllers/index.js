function focusPassword() {
	$.password.focus();
}

function doLogin(e) {
	e.source.blur();
	login();
}

function login() {
	var u = $.username.value;
	var p = $.password.value;
	alert(u + ':' + p);
}

$.index.open();