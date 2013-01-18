var users = [
	{ name: 'Tony', color: 'blue' },
	{ name: 'Chris', color: 'red' },
	{ name: 'Bryan', color: 'red' },
	{ name: 'Christian', color: 'blue' },
	{ name: 'Ingo', color: 'orange' }
];

migration.up = function(migrationObj) {
	for (var i = 0; i < users.length; i++) {
		migrationObj.insertRow(users[i]);
	}
};

migration.down = function(migrationObj) {
	for (var i = 0; i < users.length; i++) {
		migrationObj.deleteRow(users[i]);
	}
};
