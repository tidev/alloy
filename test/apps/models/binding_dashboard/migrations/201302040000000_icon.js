migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			image: 'TEXT',
			selectedImage: 'TEXT',
			badge: 'INTEGER',
			label: 'TEXT'
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("icons");
};