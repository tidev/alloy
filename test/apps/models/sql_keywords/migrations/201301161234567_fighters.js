var fighters = [
	{ name: 'Wanderlei Silva', nickname: 'The Axe Murderer'},
	{ name: 'Manny Pacquiao', nickname: 'Pac-Man'},
	{ name: 'Muhammad Ali', nickname: 'The Greatest'}
];

migration.up = function(migrator) {
	for (var i = 0; i < fighters.length; i++) {
		migrator.insertRow(fighters[i]);
	}
};

migration.down = function(migrator) {
	for (var i = 0; i < fighters.length; i++) {
		migrator.deleteRow(fighters[i]);
	}
};
