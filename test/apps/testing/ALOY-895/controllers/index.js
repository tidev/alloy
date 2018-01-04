function toggleState() {
	_.each(Alloy.Collections.heroes.models, function(model) {
		model.set('status', Math.random() > 0.5);
	});
}

if (!Ti.App.Properties.hasProperty('seeded')) {

	// add all items to collection
	Alloy.Collections.heroes.reset([{
		'name' : 'Superman',
		'status': false
	}, {
		'name' : 'Batman',
		'status': true
	}, {
		'name' : 'Spiderman',
		'status': false
	}, {
		'name' : 'Wonder Woman',
		'status': true
	}, {
		'name' : 'Tony Lukasavage',
		'status': false
	}]);

	// save all of the elements
	Alloy.Collections.heroes.each(function(_m) {
		_m.save();
	});

	Ti.App.Properties.setString('seeded', 'yuppers');
	Alloy.Collections.heroes.fetch();
}

Alloy.Collections.heroes.fetch();
$.index.open();