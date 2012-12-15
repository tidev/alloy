var user = Alloy.Models.user;
var currentRow;

function logout() {
	user.logout();
	$.home.close();
	Alloy.createController('login').getView().open();
}

function setTheme(e) {
	if (OS_IOS) {
		currentRow.hasCheck = false;
		currentRow = e.row;
		currentRow.hasCheck = true;
		user.set({theme:e.index});
	} else {
		user.set({theme:e.rowIndex});
	}
	user.save();
}

function setEmail(e) {
	user.set({email:e.source.value});
	user.save();
}

$.home.open();
user.fetch();

if (OS_IOS) {
	// set the initial state of the theme table
	currentRow = $['theme' + (user.get('theme') || 0)];
	currentRow.hasCheck = true;
} else {
	$.themes.setSelectedRow(0, user.get('theme') || 0);	
}