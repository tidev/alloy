migration.up = function(migrationObj) {
	var fighters = [
		['Wanderlei Silva','The Axe Murderer'],
		['Manny Pacquiao','Pac-Man'],
		['Muhammad Ali','The Greatest']
	];

	for (var i = 0; i < fighters.length; i++) {
		migrationObj.insert({
			name: fighters[i][0],
			nickname: fighters[i][1]
		});
	}
};

migration.down = function(migrationObj) {

};
