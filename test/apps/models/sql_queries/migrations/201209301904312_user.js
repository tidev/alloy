migration.up = function(migrationObj) {
	migrationObj.createTable({
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			name: 'TEXT',
			color: 'TEXT'
		}
	});
};

migration.down = function(migrationObj) {
	migrationObj.dropTable("users");
};
