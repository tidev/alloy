migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			text: 'TEXT'
		}
	});
	for (var i = 0; i < 20; i++) {
		migrator.insertRow({text: 'label ' + (i+1)});
	}
};

migration.down = function(migrator) {
	migrator.dropTable("collection");
};
