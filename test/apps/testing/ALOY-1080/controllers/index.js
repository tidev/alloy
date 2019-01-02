Ti.API.info('seeded: ' + Ti.App.Properties.hasProperty('seeded'));
if (!Ti.App.Properties.hasProperty('seeded')) {
	var fruits = ['durian', 'mangosteen', 'rambutan'];
	for (var i = 0, j = fruits.length; i < j; i++) {
		Alloy.createModel('fruits', { name: fruits[i]}).save();
	}
	Ti.App.Properties.setString('seeded', 'yes');
}
Alloy.Collections.fruits.fetch();

$.index.open();
