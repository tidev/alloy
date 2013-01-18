migration.up = function(migrationObj) {
	migrationObj.createTable({
		columns: {
			name: 'TEXT',
			nickname: 'TEXT',
			fighterId: 'INTEGER PRIMARY KEY AUTOINCREMENT'
		}
	});
};

migration.down = function(migrationObj) {
	migrationObj.dropTable("fighters");
};
