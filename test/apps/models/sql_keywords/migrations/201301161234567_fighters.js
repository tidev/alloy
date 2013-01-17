var fighters = [
	{ name: 'Wanderlei Silva', nickname: 'The Axe Murderer'},
	{ name: 'Manny Pacquiao', nickname: 'Pac-Man'},
	{ name: 'Muhammad Ali', nickname: 'The Greatest'}
];

migration.up = function(migrationObj) {
	for (var i = 0; i < fighters.length; i++) {
		migrationObj.insertRow(fighters[i]);
	}
};

migration.down = function(migrationObj) {
	for (var i = 0; i < fighters.length; i++) {
		migrationObj.deleteRow(fighters[i]);
	}
};
