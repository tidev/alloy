migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			name: 'TEXT',
			color: 'TEXT'
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("users");
};
