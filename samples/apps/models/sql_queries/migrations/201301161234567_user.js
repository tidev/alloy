var users = [
	{ name: 'Tony', color: 'blue' },
	{ name: 'Chris', color: 'red' },
	{ name: 'Christian', color: 'blue' },
	{ name: 'Ingo', color: 'orange' }
];

migration.up = function(migrator) {
	for (var i = 0; i < users.length; i++) {
		migrator.insertRow(users[i]);
	}
};

migration.down = function(migrator) {
	for (var i = 0; i < users.length; i++) {
		migrator.deleteRow(users[i]);
	}
};
