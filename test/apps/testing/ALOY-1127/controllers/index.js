Ti.API.info('aloy1127: ' + Ti.App.Properties.hasProperty('aloy1127'));
if (!Ti.App.Properties.hasProperty('aloy1127')) {
	for (var i = 1, j = 7; i < j; i++) {
		Alloy.createModel('test', { username: 'User ' + i}).save();
	}
	Ti.App.Properties.setString('aloy1127', 'yes');
}

Alloy.Collections.test.fetch();

$.index.addEventListener('open', function () {
	$.destroy();
});

$.index.open();

render();