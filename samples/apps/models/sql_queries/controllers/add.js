var colors = ['blue','red','orange'];
var selectedColor = 'blue';

function closeKeyboard(e) {
	e.source.blur();
}

function setColor(e) {
	selectedColor = e.source.id;
	_.each(colors, function(color) {
		$[color].borderWidth = e.source.id === color ? 4 : 0;
	});
}

function addUser() {
	var users = Alloy.Collections.user;
	var model = Alloy.createModel('user', {
		name: $.name.value || '<no name>',
		color: selectedColor
	});
	users.add(model);
	model.save();

	closeWindow();
}

function closeWindow() {
	$.add.close();
}