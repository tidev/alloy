migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			name: 'TEXT',
			nickname: 'TEXT',
			fighterId: 'INTEGER PRIMARY KEY AUTOINCREMENT'
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("fighters");
};
