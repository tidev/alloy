migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			title: 'TEXT',
			subtitle: 'TEXT',
			image: 'TEXT'
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable('info');
};
