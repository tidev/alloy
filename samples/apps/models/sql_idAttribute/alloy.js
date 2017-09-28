Alloy.Collections.fighters = Alloy.createCollection('fighters');

// typically we'd do this in a migration, but let's test it here
// to make sure that custom idAttributes of type TEXT actually
// work as expected.
var fighters = [
	{ name: 'Wanderlei Silva', nickname: 'The Axe Murderer', fighterId: 'wandy' },
	{ name: 'Manny Pacquiao', nickname: 'Pac-Man', fighterId: 'manny' },
	{ name: 'Muhammad Ali', nickname: 'The Greatest', fighterId: 'ali' }
];
_.each(fighters, function(fighter) {
	var model = Alloy.createModel('fighters', fighter);
	model.save();
});