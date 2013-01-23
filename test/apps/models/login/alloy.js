if (OS_IOS) {
	Alloy.Models.user = Alloy.createModel('user');
	Alloy.Models.user.fetch();
} else {
	alert('This test app is only supported for iOS');
}

