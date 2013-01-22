migration.up = function(migrator) {
	for (var i = 0; i < 5; i++) {
		migrator.insertRow({
			name: 'Migration ' + (i+1),
			nickname: 'nickname'
		});
	}
};

migration.down = function(migrator) {
	for (var i = 0; i < 5; i++) {
		migrator.deleteRow({
			name: 'Migration ' + (i+1),
			nickname: 'nickname'
		});
	}
};
